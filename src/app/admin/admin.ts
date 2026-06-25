import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { OrganizerService } from '../services/organizer.service';
import { AuthService } from '../services/auth.service';

interface UserUI {
  id: string;
  username: string;
  email: string;
  isBlocked: boolean;
}

interface RequestUI {
  userId: string;
  username: string;
  reason: string;
  status: number;
  isFinalized: boolean;
}

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styles: ``,
})

export class AdminComponent implements OnInit {
  adminService = inject(AdminService);
  organizerService = inject(OrganizerService);
  authService = inject(AuthService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  activeTab = 'requests';
  users: UserUI[] = [];
  requests: RequestUI[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    if (!this.authService.hasRole('Admin')) {
      this.router.navigate(['/']);
      return;
    }
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getUsers().subscribe({
      next: (data: any[]) => {
        this.users = data.map(user => ({
          id: user.id || user.Id || user.userId,
          username: user.username || user.Username || user.userName,
          email: user.email || user.Email,
          isBlocked: user.isBlocked || user.IsBlocked || false
          
        }));

        console.log('Users loaded:', this.users);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.errorMessage = 'Failed to load users.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.organizerService.getOrganizerRequests().subscribe({
      next: (data: any[]) => {
        this.requests = data.map(req => ({
          userId: req.userId || req.UserId || req.user?.id || req.user?.Id,
          username: req.username || req.Username || req.user?.username || req.user?.Username,
          reason: req.reason || req.Reason || '',
          status: req.status || req.Status || 1,
          isFinalized: (req.status || req.Status) !== 1
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load organizer requests:', err);
        this.errorMessage = 'Failed to load organizer requests.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approve(userId: string) {
    this.organizerService.approveRequest(userId).subscribe({
      next: () => this.loadData(),
      error: (err) => {
        console.error('Failed to approve request:', err);
        this.errorMessage = 'Failed to approve request.';
        this.cdr.detectChanges();
      }
    });
  }

  disapprove(userId: string) {
    this.organizerService.disapproveRequest(userId).subscribe({
      next: () => this.loadData(),
      error: (err) => {
        console.error('Failed to disapprove request:', err);
        this.errorMessage = 'Failed to disapprove request.';
        this.cdr.detectChanges();
      }
    });
  }

  toggleBlock(user: UserUI) {
    if (user.isBlocked) {
      this.adminService.unblockUser(user.id).subscribe({
        next: () => this.loadData(),
        error: (err) => {
          console.error('Failed to unblock user:', err);
          this.errorMessage = 'Failed to unblock user.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.adminService.blockUser(user.id).subscribe({
        next: () => this.loadData(),
        error: (err) => {
          console.error('Failed to block user:', err);
          this.errorMessage = 'Failed to block user.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}