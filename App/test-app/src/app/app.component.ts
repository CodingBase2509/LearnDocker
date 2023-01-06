import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test-app';

  isLoggedIn = false;
  userProfile: KeycloakProfile | null = null;

  elastic_data: string = '';

  constructor(private keycloak: KeycloakService, private http: HttpClient) {}

  public async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }

    this.http.get<string>('https://localhost:9200/profiles/_search', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa('elatic:test1234')}`
      }),
      responseType: "json",
      withCredentials: true
    }).subscribe(data => {
      this.elastic_data = JSON.stringify(data);
    });
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
