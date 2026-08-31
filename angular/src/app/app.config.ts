import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideTanStackQuery,
  QueryClient
} from '@tanstack/angular-query-experimental';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTanStackQuery(queryClient)
  ]
};
