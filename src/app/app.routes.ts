import { Routes } from '@angular/router';
import { UserPage } from './user-page/user-page';
import { Events } from './events/events';
import { AboutComponent } from './about/about';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { EventPageComponent } from './event-page/event-page';
import { Analytics } from './analytics/analytics';

export const routes: Routes =
    [
        {
            path: '',
            component: Events
        },
        {
            path: 'user/:userId',
            component: UserPage
        },
        {
            path: 'event-page/:eventId',
            component: EventPageComponent
        },
        {
            path: 'analytics/:eventId',
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
        }

    ];
