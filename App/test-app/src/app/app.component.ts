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
      withCredentials: true,
      headers: new HttpHeaders().append('username', 'elastic').append('password', 'test1234'),
    }).subscribe(data => {
      this.elastic_data = data;
    });
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
