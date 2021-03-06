import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserDetails, LoginPayload, RegistrationPayload, TokenResponse } from './authentication.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * service used for user authentication:
 *
 * handling of JSON web tokens and local storage, login / register http requests.
 */
@Injectable()
export class AuthenticationService {
	readonly API_URL = '/api/user';
	private token: string;

	constructor(private http: HttpClient, private router: Router) {
		// this.logout(); // <<--------------------- REMOVE
	}

	/**
	 * stores token in memory & local storage.
	 * @param token token string to be stored.
	 */
	private saveToken(token: string): void {
		localStorage.setItem('mviwo-token', token);
		this.token = token;
	}

	/**
	 * retrieves token from memory or local storage.
	 * @returns token string.
	 */
	public getToken(): string {
		if (!this.token) {
			this.token = localStorage.getItem('mviwo-token');
		}

		return this.token;
	}

	/**
	 * removes token from memory & local storage.
	 * redirects client to application root.
	 */
	public logout(): void {
		this.router.navigateByUrl('/login');
		this.token = '';
		localStorage.removeItem('mviwo-token');
	}

	/**
	 * @returns object containing user details.
	 */
	public getUserDetails(): UserDetails {
		const token = this.getToken();

		if (token) {
			return JSON.parse(window.atob(token.split('.')[1]));
		}

		return null;
	}

	/**
	 * checks token expiration date.
	 * @returns true if token has not expired yet, false otherwise.
	 */
	public isLoggedIn(): boolean {
		const user = this.getUserDetails();

		if (user) {
			return user.exp > Date.now() / 1000;
		}

		return false;
	}

	/**
	 * checks if user has given permission.
	 * @param element model equivalent. case insensitive.
	 * @param what operation, lower-case camel.
	 */
	public hasPermission(element: String, what?: String): boolean {
		const permissions = this.getUserDetails().permissions;
		element = element.toLocaleLowerCase().replace(/[\s]/g, '-');
		return permissions.includes(`${element}:${what}`) ||
			permissions.includes(`${element.substring(0, element.length - 1)}:${what}`) ||
			permissions.includes(`${element}`) ||
			permissions.includes(`${element.substring(0, element.length - 1)}`);
	}

	public login(user: LoginPayload): Observable<TokenResponse> {
		return this.request('post', 'login', user);
	}

	public loginWithToken(token: string): Promise<TokenResponse> { // TODO: might need further validation or reduced permissions.
		return new Promise((resolve, reject) => {
			this.saveToken(token);
			const user = this.getUserDetails();
			if (!user.exp || user.exp === 0 || !user._id || !user.email || !user.username || !user.permissions) {
				this.token = '';
				localStorage.removeItem('mviwo-token');
				reject('invalid token');
			}
			resolve({ token: token });
		});
	}

	public register(user: RegistrationPayload): Observable<TokenResponse> {
		return this.request('post', 'register', user);
	}

	public getProfile(): Observable<any> {
		return this.request('get', 'profile');
	}

	private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: LoginPayload|RegistrationPayload): Observable<any> {
		let base;

		if (method === 'post') {
			base = this.http.post<TokenResponse>(`${this.API_URL}/${type}`, user);
		} else {
			base = this.http.get(`${this.API_URL}/${this.getUserDetails()._id}`, {
				headers: {
					Authorization: `Bearer ${this.getToken()}`
				}
			});
		}

		const response = base.pipe(
			map((data: TokenResponse) => {
				if (data.token) {
					this.saveToken(data.token);
				}

				return data;
			})
		);

		return response;
	}
}
