import { Injectable } from '@angular/core';

declare const webpackGlobalVars: any;

@Injectable()
export class ConfigurationService {
    public static apiUrl = webpackGlobalVars.api_url;

    // Add more configuration variables as needed
}
