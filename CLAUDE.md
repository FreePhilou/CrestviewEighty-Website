# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a secure, multi-tiered web application for members of the Crestview Eighty Homeowners' Association in Bigfork, Montana. The website provides different levels of access based on user roles (Admin, Board Member, Member). It is built as a single-page application (SPA) using React.

The site replaces a static HTML/CSS approach to enable advanced functionality like secure user authentication and dynamic content management.

## Technology Stack

- **Frontend**: React (functional components and hooks)
- **Styling**: Tailwind CSS (for modern, responsive layouts)
- **Icons**: Lucide React
- **Dependencies**: Managed via npm or yarn (build process required)

## Architecture

The application features a secure, multi-tiered architecture to serve different user roles:

- **Landing Page**: A minimalist public-facing page for login and contact
- **Admin Portal (Tier 1)**: Full-access portal for administrators to manage all aspects of the website
- **Board Member Portal (Tier 2)**: Restricted access for board members with enhanced visibility
- **Member Portal (Tier 3)**: Standard access for all homeowners

## Key Features

- **Finalized Landing Page**: A minimalist home page with a scenic background, the HOA name, and clear navigation buttons for Map, Contact, and Homeowner Login
- **Multi-tiered Access**: Distinct portals for Admins, Board Members, and standard Members with varying levels of visibility and functionality
- **User Management**: Functionality for creating, editing, and assigning user permissions
- **Document Management**: A system for uploading and securely storing HOA documents
- **Dynamic Content**: Ability to update website content such as information banners, disclaimers, and event countdowns from the Admin portal
- **Forms and Communication**: A simple contact form for residents to reach out to management
- **Event Calendar**: (Planned) An interactive calendar for community events and board meetings
- **Dues Payment Integration**: (Planned) A secure system for members to view and pay their HOA dues online

## Design & UI

The design is a clean, modern interface with a vibrant, scenic background photo. The layout uses a semi-transparent, frosted-glass effect on modals and cards to ensure readability. The color palette features gradients of indigo and purple for accents. The design is fully responsive and optimized for all devices.

## To-Do List

- [ ] Implement the secure, multi-tiered authentication system
- [ ] Develop the Admin Portal with user management and content editing capabilities
- [ ] Create the Board Member and Member portals with distinct content visibility
- [ ] Integrate a backend to handle document storage, user data, and form submissions
- [ ] Develop the Event Calendar feature
- [ ] Implement Dues Payment Integration