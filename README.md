# `src` directory layout
```
src/
  app/
    page.tsx                          # redirects to /home if logged in, else /login
    layout.tsx
    (dashboard)/
      layout.tsx                      # sidebar: Home, Rubrics, Profile (+Templates if Admin)
      my-rubrics/
        page.tsx                      # Google Drive-style “My Rubrics” list/grid + NewRubricModal
      rubric/
        [id]/
          edit/
            page.tsx                  # rubric editor (5 columns)
            actions.ts                # server actions (save rows, rename, etc.)
      profile/
        page.tsx
        actions.ts
      rubric-repo/
        page.tsx                      # Admin: list templates by subject
        new/
          page.tsx                    # Admin: new template (name, subject)
        [templateId]/
          page.tsx                    # Admin: edit template rows
          actions.ts
    api/
      export/
        cus/
          [id]/
            route.ts                   # returns .xlsx for a rubric
    auth/
      callback/
        route.ts                       # redirects to /home after log in
    login/
      page.tsx                        # magic-link form (no sidebar)
  components/
    shared/
      SidebarNav.tsx                  # 4 tabs, active state via usePathname()
      NewRubricModal.tsx              # scratch vs repository, choose subject/template
      ...
    five-row-table/
      index.tsx                       # client component, 5 editable columns
      row.tsx                         # row editor
      schema.ts                       # zod validation for a row
    ui/                               # shadcn components you add
      ...
```

# Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
