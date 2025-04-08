import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export class AdminController {
  // Custom login page handler
  static login(req: Request, res: Response) {
    // If already authenticated, redirect to admin resources
    if (req.isAuthenticated()) {
      return res.redirect('/admin/resources');
    }
    
    // Serve the custom login page
    const loginHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AdmitQuest Admin Login</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .login-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 40px;
            width: 320px;
            text-align: center;
          }
          h1 {
            color: #333;
            margin-bottom: 24px;
          }
          .google-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #4285F4;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 16px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            margin-top: 24px;
            transition: background-color 0.2s;
          }
          .google-btn:hover {
            background-color: #3367D6;
          }
          .google-icon {
            margin-right: 10px;
          }
          p {
            color: #666;
            margin-top: 16px;
            font-size: 14px;
          }
          .error-message {
            color: #dc3545;
            margin-top: 16px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="login-container">
          <h1>AdmitQuest Admin</h1>
          <p>Please sign in using your Google account</p>
          <button class="google-btn" onclick="window.location.href='/admin/auth/google'">
            <span class="google-icon">
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            </span>
            Sign in with Google
          </button>
          <p>Only @sunstone.in or @collegesearch.in email domains are allowed</p>
          ${req.query.error ? `<p class="error-message">${req.query.error === 'authentication_failed' ? 'Authentication failed. Please make sure you are using an authorized email domain.' : req.query.error}</p>` : ''}
        </div>
      </body>
      </html>
    `;
    
    res.send(loginHtml);
  }
  
  // Dashboard page - normally handled by AdminJS
  static dashboard(req: Request, res: Response) {
    // This should be handled by AdminJS, but we include it for completeness
    res.redirect('/admin');
  }
} 