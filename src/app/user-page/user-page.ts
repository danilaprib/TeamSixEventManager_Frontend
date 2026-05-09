import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-page',
  imports: [RouterLink],
  templateUrl: './user-page.html',
  styles: `
    .hover-gray{
      background-color: #FFFFFF;
      transition: 0.2s;
    }
    .hover-gray:hover{

      background-color: #eaeaea;
    }
    .nav-pills .nav-link.active {
    background-color: var(--main-color) !important;
    color: white !important;
    }
    .nav-link:hover:not(.active) {
        background-color: #dadada !important;
    }

  `
})
export class UserPage {
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  activeTab: string = 'wishlist';

  tags = [
    { name: 'Concerts', selected: true },
    { name: 'Football', selected: true },
    { name: 'Basketball', selected: false },
    { name: 'Art', selected: false },
    { name: 'Food', selected: true },
    { name: 'Tech', selected: true },
    { name: 'Business', selected: false },
    { name: 'Photography', selected: false },
    { name: 'Marathon', selected: false },
    { name: 'Jazz', selected: false },
    { name: 'Clasicall Music', selected: false },
    { name: 'Workshops', selected: false },
    { name: 'Networking', selected: false },
    { name: 'Outdoor', selected: false },
    { name: 'Family', selected: false },
  ];

  toggleTag(tag: any) {
    tag.selected = !tag.selected;
  }

  resetTags() {
    this.tags.forEach(t => t.selected = false);
  }

  get selectedCount() {
    return this.tags.filter(t => t.selected).length;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
