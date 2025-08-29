import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

// 👇 Configure PDF.js worker location for standalone setup
pdfDefaultOptions.assetsFolder = 'assets/';

// Initialize AOS
// AOS.init({
//   duration: 600,
//   easing: 'ease-in-out',
//   once: false,
//   offset: 50,
//   delay: 0,
//   disable: 'mobile', // Disable on mobile for better performance
// });

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
