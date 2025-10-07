# UI Components Documentation

This document provides comprehensive documentation for the shadcn/ui components used in this project.

## Table of Contents

1. [Breadcrumb](#breadcrumb)
2. [Form](#form)
3. [Sidebar](#sidebar)
4. [Button Group](#button-group)
5. [Item](#item)

---

## Breadcrumb

A breadcrumb navigation component that displays the current page's location within the site hierarchy.

### Components

- `Breadcrumb` - Root container for the breadcrumb navigation
- `BreadcrumbList` - Ordered list wrapper for breadcrumb items
- `BreadcrumbItem` - Individual breadcrumb item
- `BreadcrumbLink` - Clickable link for navigation
- `BreadcrumbPage` - Current page indicator (non-clickable)
- `BreadcrumbSeparator` - Visual separator between items
- `BreadcrumbEllipsis` - Collapsed items indicator

### Basic Usage

\`\`\`tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
\`\`\`

### With Next.js Link

\`\`\`tsx
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function BreadcrumbWithNextLink() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
\`\`\`

### With Ellipsis

\`\`\`tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb'

export function BreadcrumbWithEllipsis() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Item</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
\`\`\`

### Custom Separator

\`\`\`tsx
import { Slash } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function BreadcrumbCustomSeparator() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Products</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
\`\`\`

### Props

#### BreadcrumbLink

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Use Radix UI Slot for custom components |
| `className` | `string` | - | Additional CSS classes |

#### BreadcrumbSeparator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `<ChevronRight />` | Custom separator icon |
| `className` | `string` | - | Additional CSS classes |

---

## Form

A form component built on top of `react-hook-form` that provides accessible form fields with validation.

### Components

- `Form` - Root form provider (alias for `FormProvider` from react-hook-form)
- `FormField` - Wrapper for controlled form fields
- `FormItem` - Container for a single form field
- `FormLabel` - Label for the form field
- `FormControl` - Wrapper for the input element
- `FormDescription` - Helper text for the field
- `FormMessage` - Error message display

### Basic Usage

\`\`\`tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
\`\`\`

### With Select

\`\`\`tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Inside your form:
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="guest">Guest</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
\`\`\`

### With Checkbox

\`\`\`tsx
import { Checkbox } from '@/components/ui/checkbox'

// Inside your form:
<FormField
  control={form.control}
  name="marketing"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>
          Marketing emails
        </FormLabel>
        <FormDescription>
          Receive emails about new products and features.
        </FormDescription>
      </div>
    </FormItem>
  )}
/>
\`\`\`

### Hook: useFormField

Access form field state within custom components:

\`\`\`tsx
import { useFormField } from '@/components/ui/form'

function CustomFormComponent() {
  const { error, formItemId } = useFormField()
  
  return (
    <div>
      <input id={formItemId} />
      {error && <span>{error.message}</span>}
    </div>
  )
}
\`\`\`

### Props

#### FormField

| Prop | Type | Description |
|------|------|-------------|
| `control` | `Control` | Form control from `useForm` |
| `name` | `string` | Field name |
| `render` | `function` | Render function receiving field props |

---

## Sidebar

A collapsible sidebar component with mobile support and keyboard shortcuts.

### Components

- `SidebarProvider` - Root provider for sidebar state
- `Sidebar` - Main sidebar container
- `SidebarTrigger` - Button to toggle sidebar
- `SidebarHeader` - Header section
- `SidebarContent` - Scrollable content area
- `SidebarFooter` - Footer section
- `SidebarMenu` - Menu list container
- `SidebarMenuItem` - Individual menu item
- `SidebarMenuButton` - Clickable menu button
- `SidebarMenuSub` - Submenu container
- `SidebarInset` - Main content area
- `SidebarRail` - Drag handle for resizing

### Basic Usage

\`\`\`tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Home, Settings, Users } from 'lucide-react'

export function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h2 className="px-2 text-lg font-semibold">My App</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/">
                      <Home />
                      <span>Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/users">
                      <Users />
                      <span>Users</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className="px-2 text-xs text-muted-foreground">© 2025 My App</p>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
\`\`\`

### With Layout

\`\`\`tsx
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <h1>Dashboard</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
\`\`\`

### With Submenu

\`\`\`tsx
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function SidebarWithSubmenu() {
  return (
    <SidebarMenu>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <span>Products</span>
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <a href="/products/electronics">Electronics</a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <a href="/products/clothing">Clothing</a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
}
\`\`\`

### With Tooltip (Icon Mode)

\`\`\`tsx
<SidebarMenuButton tooltip="Home" asChild>
  <a href="/">
    <Home />
    <span>Home</span>
  </a>
</SidebarMenuButton>
\`\`\`

### Hook: useSidebar

Access sidebar state in any component:

\`\`\`tsx
import { useSidebar } from '@/components/ui/sidebar'

function MyComponent() {
  const { state, open, setOpen, toggleSidebar, isMobile } = useSidebar()
  
  return (
    <div>
      <p>Sidebar is {state}</p>
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  )
}
\`\`\`

### Props

#### SidebarProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `true` | Initial open state |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `function` | - | Callback when open state changes |

#### Sidebar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `'left' \| 'right'` | `'left'` | Side of the screen |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | Visual variant |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | Collapse behavior |

#### SidebarMenuButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Use Slot for custom component |
| `isActive` | `boolean` | `false` | Active state styling |
| `tooltip` | `string \| object` | - | Tooltip text (shown when collapsed) |
| `variant` | `'default' \| 'outline'` | `'default'` | Visual variant |
| `size` | `'default' \| 'sm' \| 'lg'` | `'default'` | Button size |

### Keyboard Shortcuts

- `Cmd/Ctrl + B` - Toggle sidebar

---

## Button Group

A component for grouping related buttons together with shared borders.

### Components

- `ButtonGroup` - Container for grouped buttons
- `ButtonGroupText` - Text label within button group
- `ButtonGroupSeparator` - Visual separator between items

### Basic Usage

\`\`\`tsx
import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator
} from '@/components/ui/button-group'

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  )
}
\`\`\`

### Vertical Orientation

\`\`\`tsx
import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator
} from '@/components/ui/button-group'

export function VerticalButtonGroup() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  )
}
\`\`\`

### With Text Label

\`\`\`tsx
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'

export function ButtonGroupWithText() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Sort by:</ButtonGroupText>
      <Button variant="outline">Name</Button>
      <Button variant="outline">Date</Button>
      <Button variant="outline">Size</Button>
    </ButtonGroup>
  )
}
\`\`\`

### With Separator

\`\`\`tsx
import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/components/ui/button-group'

export function ButtonGroupWithSeparator() {
  return (
    <ButtonGroup>
      <Button variant="outline">Copy</Button>
      <Button variant="outline">Cut</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Paste</Button>
    </ButtonGroup>
  )
}
\`\`\`

### With Icons

\`\`\`tsx
import { Button } from '@/components/ui/button'
import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator
} from '@/components/ui/button-group'
import { Bold, Italic, Underline } from 'lucide-react'

export function ButtonGroupWithIcons() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <Bold className="size-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Italic className="size-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Underline className="size-4" />
      </Button>
    </ButtonGroup>
  )
}
\`\`\`

### Props

#### ButtonGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `className` | `string` | - | Additional CSS classes |

#### ButtonGroupText

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Use Slot for custom component |
| `className` | `string` | - | Additional CSS classes |

---

## Item

A flexible component for displaying list items with media, content, and actions.

### Components

- `ItemGroup` - Container for multiple items
- `Item` - Individual item container
- `ItemMedia` - Media section (icon or image)
- `ItemContent` - Main content area
- `ItemTitle` - Item title
- `ItemDescription` - Item description
- `ItemActions` - Action buttons area
- `ItemHeader` - Header section (spans full width)
- `ItemFooter` - Footer section (spans full width)
- `ItemSeparator` - Separator between items

### Basic Usage

\`\`\`tsx
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/components/ui/item'

export function ItemDemo() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>Item Title</ItemTitle>
        <ItemDescription>
          This is a description of the item with some additional details.
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}
\`\`\`

### With Icon

\`\`\`tsx
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/components/ui/item'
import { Mail } from 'lucide-react'

export function ItemWithIcon() {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Mail />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>New Message</ItemTitle>
        <ItemDescription>You have a new message from John</ItemDescription>
      </ItemContent>
    </Item>
  )
}
\`\`\`

### With Image

\`\`\`tsx
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/components/ui/item'

export function ItemWithImage() {
  return (
    <Item variant="muted">
      <ItemMedia variant="image">
        <img src="/avatar.jpg" alt="User avatar" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>John Doe</ItemTitle>
        <ItemDescription>Software Engineer</ItemDescription>
      </ItemContent>
    </Item>
  )
}
\`\`\`

### With Actions

\`\`\`tsx
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

export function ItemWithActions() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>Project Name</ItemTitle>
        <ItemDescription>Last updated 2 hours ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </ItemActions>
    </Item>
  )
}
\`\`\`

### With Header and Footer

\`\`\`tsx
import {
  Item,
  ItemHeader,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemFooter,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'

export function ItemWithHeaderFooter() {
  return (
    <Item variant="outline">
      <ItemHeader>
        <Badge>New</Badge>
        <span className="text-xs text-muted-foreground">2 hours ago</span>
      </ItemHeader>
      <ItemContent>
        <ItemTitle>Feature Update</ItemTitle>
        <ItemDescription>
          We've added new features to improve your experience
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <Button variant="link" size="sm">Learn more</Button>
      </ItemFooter>
    </Item>
  )
}
\`\`\`

### Item Group with Separators

\`\`\`tsx
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemSeparator,
} from '@/components/ui/item'

export function ItemGroupDemo() {
  return (
    <ItemGroup>
      <Item>
        <ItemContent>
          <ItemTitle>First Item</ItemTitle>
          <ItemDescription>Description for first item</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemContent>
          <ItemTitle>Second Item</ItemTitle>
          <ItemDescription>Description for second item</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemContent>
          <ItemTitle>Third Item</ItemTitle>
          <ItemDescription>Description for third item</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
\`\`\`

### As Link

\`\`\`tsx
import Link from 'next/link'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/components/ui/item'

export function ItemAsLink() {
  return (
    <Item asChild>
      <Link href="/details">
        <ItemContent>
          <ItemTitle>Clickable Item</ItemTitle>
          <ItemDescription>Click anywhere to navigate</ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  )
}
\`\`\`

### Props

#### Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline' \| 'muted'` | `'default'` | Visual variant |
| `size` | `'default' \| 'sm'` | `'default'` | Item size |
| `asChild` | `boolean` | `false` | Use Slot for custom component |
| `className` | `string` | - | Additional CSS classes |

#### ItemMedia

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'icon' \| 'image'` | `'default'` | Media type styling |
| `className` | `string` | - | Additional CSS classes |

---

## Best Practices

### Accessibility

1. **Breadcrumb**: Always include `aria-label="breadcrumb"` on the root element (automatically included)
2. **Form**: Use `FormLabel` for all inputs to ensure proper labeling
3. **Sidebar**: Keyboard shortcut (Cmd/Ctrl + B) is built-in for accessibility
4. **Button Group**: Use `role="group"` (automatically included)
5. **Item**: Use semantic HTML and proper ARIA attributes when needed

### Performance

1. **Form**: Use `react-hook-form` with `zodResolver` for optimal performance
2. **Sidebar**: State is managed efficiently with React context
3. **Item**: Use `asChild` prop to avoid unnecessary DOM nesting

### Styling

1. All components support `className` prop for custom styling
2. Use Tailwind utility classes for quick customizations
3. Components use CSS variables for theming (defined in `globals.css`)
4. Dark mode is supported automatically through design tokens

### Common Patterns

1. **Breadcrumb**: Use with Next.js `usePathname()` to generate dynamic breadcrumbs
2. **Form**: Combine with server actions for form submission
3. **Sidebar**: Use with Next.js layouts for persistent navigation
4. **Button Group**: Great for toolbar and formatting controls
5. **Item**: Perfect for lists, feeds, and notification displays
