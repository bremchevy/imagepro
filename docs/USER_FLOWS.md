# Image?ro - User Flows

## 1. Navigation & Dashboard Access

### Authenticated User Navigation
1. User accesses platform
2. Views main navigation with items:
   - Home
   - My Tools (Dashboard)
   - Projects
   - Account
   - Help
3. Clicks "My Tools"
4. Views dashboard with:
   - Left sidebar: List of available tools
   - Main content: Selected tool interface
5. Can switch between tools using sidebar

### Non-Authenticated User Navigation
1. User accesses platform
2. Views main navigation with items:
   - Home
   - My Tools (Dashboard)
   - Help
3. Clicks "My Tools" or any tool
4. Views blurred interface with:
   - White overlay on content
   - Authentication dialog with options:
     - "Register" button
     - "Login" button
5. Must authenticate to access tools

## 2. User Registration & Authentication

### New User Registration
1. User lands on homepage (Next.js)
2. Clicks "Sign Up" button
3. Fills registration form:
   - Email address
   - Password
   - Name
4. Supabase Auth handles verification
5. Completes profile setup
6. Redirected to My Tools dashboard

### User Login
1. User clicks "Login" button
2. Enters credentials
3. Supabase Auth validates
4. Redirected to My Tools dashboard

### Password Recovery
1. User clicks "Forgot Password"
2. Enters email address
3. Supabase sends reset link
4. Sets new password
5. Redirected to login

## 3. Tool Access & Processing

### Tool Selection
1. User accesses My Tools dashboard
2. Views sidebar with tool categories:
   - Background Removal
   - Image Upscaling
   - Object Removal
   - Filters & Effects
   - Batch Processing
3. Selects desired tool
4. Views tool interface in main content area

### Basic Image Upload
1. User navigates to My Tools dashboard
2. Selects tool from sidebar
3. Clicks "Upload Image" button
4. Selects image from device
5. Image preview appears
6. Adjusts tool parameters
7. Clicks "Process"
8. Background Remover API processes image
9. Views results
10. Downloads or shares

### Batch Processing
1. User selects multiple images
2. Chooses operation type
3. Sets batch parameters
4. Initiates processing
5. Views progress
6. Downloads results

## 4. Premium Features Access

### Subscription Upgrade
1. User views premium features
2. Clicks "Upgrade" button
3. Selects subscription plan
4. Paystack handles payment
5. Confirms subscription
6. Gains access to premium features

### Premium Feature Usage
1. User selects premium tool
2. System verifies subscription
3. User accesses feature
4. Processes image
5. Downloads result

## 5. Image Editing Workflow

### Background Removal
1. Upload image to Supabase Storage
2. Select "Remove Background" tool
3. Background Remover API processes
4. Preview result
5. Fine-tune if needed
6. Download result

### Image Upscaling
1. Upload image
2. Select "Upscale" tool
3. Choose upscale factor
4. Set quality parameters
5. Process image
6. Preview result
7. Download

### Object Removal
1. Upload image
2. Select "Remove Object" tool
3. Mark object to remove
4. Adjust removal area
5. Process
6. Preview result
7. Download

## 6. Project Management

### Creating New Project
1. Click "New Project"
2. Enter project name
3. Select project type
4. Add initial images
5. Set project settings
6. Save project (Supabase)

### Project Organization
1. Access project dashboard
2. Create folders/categories
3. Move images to folders
4. Add tags/labels
5. Set sharing permissions

## 7. Sharing & Collaboration

### Sharing Images
1. Select image(s)
2. Click "Share" button
3. Choose sharing method:
   - Link
   - Email
   - Social media
4. Set permissions
5. Generate share link

### Collaborative Editing
1. Share project with team
2. Set access levels
3. Team members access project
4. Edit images
5. Track changes
6. Download final versions

## 8. Export & Download

### Single Image Export
1. Select image
2. Click "Export"
3. Choose format
4. Set quality/parameters
5. Download

### Batch Export
1. Select multiple images
2. Choose export format
3. Set batch parameters
4. Process
5. Download zip file

## 9. Account Management

### Profile Settings
1. Access profile page
2. Update personal info
3. Change password
4. Set preferences
5. Save changes

### Subscription Management
1. Access subscription page
2. View current plan
3. Modify subscription
4. Update payment method (Paystack)
5. Cancel subscription

## 10. Support & Help

### Accessing Help
1. Click help icon
2. Browse documentation
3. Search for topics
4. View tutorials
5. Contact support

### Reporting Issues
1. Click "Report Issue"
2. Select issue type
3. Describe problem
4. Attach screenshots
5. Submit report 