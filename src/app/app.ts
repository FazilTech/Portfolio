import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfterViewInit } from '@angular/core';
import{
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms'
import { ContactService } from './services/contact';
import { finalize } from 'rxjs';
import { OnInit } from '@angular/core';
import {
  NgxParticlesModule,
  NgParticlesService
} from '@tsparticles/angular';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

interface Projects {
  title: string,
  project_name: string,
  description: string,
  tags: string[],
  link: string
}

interface Experiences {
  role: string,
  org: string,
  period: string,
  detail: string
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, NgxParticlesModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnInit{

  contactForm: FormGroup;

  successMessage = '';
  errorMessage = '';

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private cdf: ChangeDetectorRef,
    private particlesService: NgParticlesService
  ){
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
      this.cdf.detectChanges();
    }, 5000);
  }

  onSubmit(): void{
    if(this.contactForm.invalid){
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.cdf.detectChanges();

    this.contactService
      .sendMessage(this.contactForm.value)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdf.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response;
          this.contactForm.reset();
        
          this.clearMessagesAfterDelay();
          this.cdf.detectChanges();
        },
      
        error: (error) => {
          console.error('Contact API Error: ', error);
        
          this.errorMessage =
            'Unable to send the message. Please try again later.';
        
          this.clearMessagesAfterDelay();
          this.cdf.detectChanges();
        }
      });
  }

  ngAfterViewInit() {

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          const element = entry.target as HTMLElement;
          const delay = Number(element.dataset['delay']) || 0;

          setTimeout(()=>{
            element.classList.add('visible');
          }, delay);

          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.2
    });


      
    document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right'
    ).forEach((element) => {
      observer.observe(element);
    })
  }

  ngOnInit(): void {
    void this.particlesService.init(async (engine) => {
    await loadSlim(engine);
    });
  }

  particlesOptions: ISourceOptions = {

  fullScreen: {
    enable: false
  },

  background: {
    color: '#151619'
  },

  fpsLimit: 60,

  particles: {

    number: {
      value: 65,

      density: {
        enable: true
      }
    },

    color: {
      value: ['#8B5CF6', '#3B82F6', '#A78BFA']
    },

    shape: {
      type: 'circle'
    },

    opacity: {
      value: {
        min: 0.15,
        max: 0.5
      }
    },

    size: {
      value: {
        min: 1,
        max: 3
      }
    },

    links: {
      enable: true,
      distance: 140,
      color: '#7C83FD',
      opacity: 0.22,
      width: 1
    },

    move: {
      enable: true,
      speed: 0.7,
      direction: 'none',
      random: true,
      straight: false,
      outModes: {
        default: 'out'
      }
    }

  },

  interactivity: {

    events: {

      onHover: {
        enable: true,
        mode: 'grab'
      },

      onClick: {
        enable: true,
        mode: 'push'
      }

    },

    modes: {

      grab: {
        distance: 150,
        links: {
          opacity: 0.35
        }
      },

      push: {
        quantity: 3
      }

    }

  },

  detectRetina: true

};

iconRotateX = 0;
iconRotateY = 0;

rotateIcon3D(event: MouseEvent): void {
  const wrapper = event.currentTarget as HTMLElement;
  const rect = wrapper.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateY = ((x - centerX) / centerX) * 25;
  const rotateX = ((centerY - y) / centerY) * 25;

  this.iconRotateX = rotateX;
  this.iconRotateY = rotateY;
}

resetIcon3D(): void {
  this.iconRotateX = 0;
  this.iconRotateY = 0;
}

  protected readonly year = new Date().getFullYear();

  protected readonly skills = [
    {name: "Angular", image: '/skills/angular.svg'}, 
    {name: "SpringBoot", image: '/skills/spring boot.svg'}, 
    {name: "Java", image: '/skills/java.svg'}, 
    {name: "Python", image: '/skills/python.svg'},
    {name: "Figma", image: '/skills/figma.svg'}, 
    {name: "TypeScript", image: '/skills/typescript.svg'}, 
    {name: "Rest APIs", image: '/skills/rest api.svg'}, 
    {name: "SQL", image: '/skills/sql.svg'},
    {name: "Data Analysis", image: '/skills/data analysis.svg'}, 
    {name: "UI/UX Design", image: '/skills/UI UX.svg'} 
  ];

  protected readonly project: Projects[] = [
    {
      title: "Full Stack",
      project_name: "Shopsphere E-Commerce Website",
      description: 'A end-to-end web application with a responsive Angular interface and a Spring Boot REST API, designed first in Figma to map every user flow before a line of code was written.',
      tags: ['Angular', 'Spring Boot', 'Figma', 'MySQL'],
      link: 'https://github.com/AnkitK2901/ShopSphere-Frontend'
    },
    {
      title: "Frontend + Design",
      project_name: "Water waste Management",
      description: 'A polished, component-driven UI built from a Figma design system, focused on accessibility, responsive layouts, and smooth state-driven interactions.',
      tags: ['Angular', 'Figma'],
      link: 'https://github.com/FazilTech/AQ'
    },
    {
      title: "Backend + Design",
      project_name: "Recycle waste Management",
      description: 'A Flutter based application used for the recycling of the waste. Identifying harmful elements presence and Interaction with the recycle stores.',
      tags: ['Firebase', 'Flutter', 'Python', 'Rest API'],
      link: 'https://github.com/FazilTech/EkoSortify'
    }
  ]

  protected readonly experience: Experiences[] = [
    {
      role: 'Software Development Intern',
      org: 'Cognizant Technology Solutions (CTS)',
      period: 'Feb 2026 - Jun 2026',
      detail: 'Contributed to full stack development tasks, gaining hands-on exposure to enterprise software practices, Java-based development, and collaborative team workflows.'
    },
    {
      role: 'B.Tech, Computer Science & Engineering',
      org: 'Specialization: Data Science & Full Stack Development',
      period: 'Graduate',
      detail: 'Built a strong foundation in software development, data analysis, and product management — from concept through to delivery.'
    },
    {
      role: 'Higher Secondary Education (Class XII)',
      org: 'Petit Seminaire Higher Secondary School',
      period: 'School',
      detail: 'Focused on Mathematics and Biology.'
    },
  ];

  protected readonly conntectapp = [
    {name: "Email", image: '/skills/gmail.svg', link: 'mailto:fazilahamed2003@gmail.com'}, 
    {name: "LinkedIn", image: '/skills/linkedin.svg', link: 'https://www.linkedin.com/in/fazilahamedm'}, 
    {name: "Fiverr", image: '/skills/fiverr.svg', link: 'https://www.fiverr.com/fazil_ahamed'}, 
    {name: "GitHub", image: '/skills/github.svg', link: 'https://github.com/FazilTech'}
  ];

}
