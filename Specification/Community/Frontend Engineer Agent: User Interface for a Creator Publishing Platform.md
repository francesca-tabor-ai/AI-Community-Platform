# Frontend Engineer Agent: User Interface for a Creator Publishing Platform

## UI Component Structure

The frontend application will be built using React with TypeScript, following a component-based architecture. Components will be organized into a hierarchical structure, promoting reusability, maintainability, and clear separation of concerns. A design system approach will be adopted to ensure consistency and accelerate development.

### Core Components (Design System)

*   **Atoms:** Basic UI elements (e.g., `Button`, `Input`, `Text`, `Icon`, `Avatar`).
*   **Molecules:** Combinations of atoms forming simple, reusable UI units (e.g., `FormField`, `Card`, `Dropdown`).
*   **Organisms:** Complex UI sections composed of molecules and atoms (e.g., `Header`, `Sidebar`, `PostEditor`, `CommentSection`).
*   **Templates:** Page-level layouts that arrange organisms (e.g., `CreatorDashboardLayout`, `PostViewLayout`).
*   **Pages:** Instances of templates with specific content (e.g., `HomePage`, `PostDetailPage`, `ProfilePage`).

### Key Application-Specific Components

*   **Authentication:** `LoginForm`, `RegisterForm`
*   **Navigation:** `Navbar`, `SidebarNavigation`
*   **Content Creation:** `RichTextEditor`, `PublishButton`, `DraftsList`
*   **Content Display:** `PostCard`, `PostDetail`, `CommentList`, `CommentInput`
*   **User Profiles:** `UserProfileHeader`, `CreatorPostsList`
*   **Analytics:** `AnalyticsDashboardWidget`

## Page Structure

### 1. Authentication Pages
*   `/login`: Contains `LoginForm` component.
*   `/register`: Contains `RegisterForm` component.

### 2. Creator Dashboard
*   `/dashboard`: Displays `CreatorDashboardLayout` with `AnalyticsDashboardWidget`, `DraftsList`, and `CreatorPostsList`.
*   `/new-post`: Contains `RichTextEditor` and `PublishButton`.
*   `/edit-post/:id`: Contains `RichTextEditor` pre-filled with post content and `PublishButton`.

### 3. Reader/Public Pages
*   `/`: Home page, potentially showcasing featured creators or posts.
*   `/creator/:username`: Public profile page for a creator, displaying their bio and published posts.
*   `/post/:id`: Detail view of a single post, including `PostDetail` and `CommentSection`.

### 4. User Profile
*   `/profile`: Displays `UserProfileHeader` and allows users to edit their bio.

## State Management Approach

For a React application, a combination of local component state, React Context API, and a global state management library will be used.

*   **Local Component State:** For UI-specific state that doesn't need to be shared (e.g., form input values, dropdown open/close status).
*   **React Context API:** For sharing moderately complex state across a subtree of components without prop drilling (e.g., user authentication status, theme settings).
*   **Global State Management (e.g., Zustand or React Query):** For managing application-wide state, especially data fetched from APIs, and handling caching, loading, and error states. React Query is particularly well-suited for managing asynchronous data.

### Data Flow Example (Post Publishing)

1.  `RichTextEditor` component manages its internal content state.
2.  `PublishButton` component, when clicked, dispatches an action to a global state manager (or calls an API integration hook).
3.  The global state manager (e.g., React Query mutation) sends the post data to the Backend API.
4.  Upon successful response, the global state is updated (e.g., invalidate `creatorPosts` cache), and the UI reflects the published post.

## API Integration Plan

API integration will be handled using a dedicated data fetching library, such as **React Query** (or SWR). This library provides powerful hooks for fetching, caching, synchronizing, and updating server state in React applications.

*   **Centralized API Client:** A single instance of an API client (e.g., Axios instance) configured with base URL, headers (including JWT for authenticated requests), and interceptors for error handling.
*   **Custom Hooks:** Create custom React hooks (e.g., `usePosts`, `useCreatePost`, `useComments`) that encapsulate API calls and manage their loading, error, and data states.
*   **Authentication:** JWT will be stored securely (e.g., in `localStorage` or `sessionStorage` with appropriate security measures, or `HttpOnly` cookies) and automatically attached to outgoing requests via an Axios interceptor.
*   **Error Handling:** Global error boundaries and specific error handling within hooks to display user-friendly messages for API failures.
*   **Data Invalidation/Refetching:** React Query will automatically handle data invalidation and refetching when mutations occur (e.g., publishing a post should refetch the creator's post list).

## Performance Optimization Strategy

### 1. Code Splitting & Lazy Loading
*   Use React's `React.lazy()` and `Suspense` to code-split the application into smaller bundles, loading only the necessary code for the current view. This reduces initial load time.

### 2. Image Optimization
*   Serve optimized and responsive images (e.g., using `srcset` and `sizes` attributes, WebP format).
*   Lazy load images that are not immediately visible (e.g., using `loading="lazy"` attribute or intersection observer).

### 3. Component Memoization
*   Use `React.memo()`, `useMemo()`, and `useCallback()` to prevent unnecessary re-renders of components and expensive computations.

### 4. Virtualization/Windowing
*   For long lists (e.g., comments, posts on a creator's page), use virtualization libraries (e.g., `react-window`, `react-virtualized`) to render only the visible items, significantly improving performance.

### 5. Server-Side Rendering (SSR) or Static Site Generation (SSG) (Future Consideration)
*   For public-facing content (e.g., post detail pages), consider SSR or SSG to improve initial load performance and SEO. This would be a V2/V3 feature.

### 6. Caching
*   Leverage browser caching for static assets.
*   Utilize React Query's caching mechanisms for API data.

### 7. Accessibility (A11y)
*   Implement semantic HTML.
*   Ensure proper keyboard navigation and focus management.
*   Provide ARIA attributes where necessary.
*   Ensure sufficient color contrast.

### 8. Bundle Analysis
*   Regularly analyze the JavaScript bundle size using tools like Webpack Bundle Analyzer to identify and remove unnecessary dependencies.

## Prioritization of Usability and Clarity

*   **Intuitive Navigation:** Clear and consistent navigation menus and breadcrumbs to help users understand where they are and how to get to other sections.
*   **Clear Feedback:** Provide immediate visual feedback for user actions (e.g., loading spinners, success/error messages for form submissions).
*   **Responsive Design:** Ensure the UI is fully responsive and adapts gracefully to various screen sizes (desktop, tablet, mobile).
*   **Error Messages:** Display user-friendly and actionable error messages, guiding users on how to resolve issues.
*   **Consistent Design Language:** Adhere to a consistent design system (colors, typography, spacing, components) to create a cohesive and professional look and feel.
*   **Minimalist Interface:** Avoid clutter and unnecessary elements, focusing on core functionality to reduce cognitive load.
*   **Accessibility:** Ensure the application is usable by individuals with disabilities, following WCAG guidelines.
