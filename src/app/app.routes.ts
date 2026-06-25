import { Routes } from '@angular/router';
import { UserPage } from './user-page/user-page';
import { Events } from './events/events';
import { AboutComponent } from './about/about';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { EventPageComponent } from './event-page/event-page';
import { Analytics } from './analytics/analytics';
import { CreateEventComponent } from './create-event/create-event';
import { AdminComponent } from './admin/admin';

export const routes: Routes =
    [
        {
            path: '',
            component: Events
        },        
        {
            path: 'events',
            component: Events
        },
        {
            path: 'user/:userId',
            component: UserPage
        },
        {
            path: 'user-page',
            component: UserPage
        },
        {
            path: 'event-page/:id',
            component: EventPageComponent
        },
        {
            path: 'create-event',
            component: CreateEventComponent
        },
        {
            path: 'analytics/:id',
            component: Analytics
        },
        {
            path: 'about',
            component: AboutComponent
        },
        {
            path: 'login',
            component: LoginComponent
        },
        {
            path: 'signup',
            component: SignupComponent
        },
        {
            path: 'admin',
            component: AdminComponent
        }


    ];
