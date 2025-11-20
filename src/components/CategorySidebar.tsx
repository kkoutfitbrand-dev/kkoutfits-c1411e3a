import { ChevronRight, Shirt, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const categories = [
  {
    title: "Men",
    icon: Shirt,
    subcategories: [
      { title: "Shirts", url: "/category/shirts" },
      { title: "T-Shirts", url: "/category/t-shirts" },
      { title: "Pants", url: "/category/pants" },
      { title: "Jeans", url: "/category/jeans" },
      { title: "Formal Wear", url: "/category/formal-wear" },
      { title: "Casual Wear", url: "/category/casual-wear" },
    ],
  },
  {
    title: "Women",
    icon: ShoppingBag,
    subcategories: [
      { title: "Sarees", url: "/category/sarees" },
      { title: "Lehengas", url: "/category/lehengas" },
      { title: "Salwar Kameez", url: "/category/salwar-kameez" },
      { title: "Kurtas", url: "/category/kurtas" },
      { title: "Casual Wear", url: "/category/women-casual" },
      { title: "Formal Wear", url: "/category/women-formal" },
    ],
  },
  {
    title: "Ethnic Wear",
    icon: Sparkles,
    subcategories: [
      { title: "Sherwanis", url: "/category/sherwanis" },
      { title: "Bandhgalas", url: "/category/bandhgalas" },
      { title: "Sarees", url: "/category/sarees" },
      { title: "Lehengas", url: "/category/lehengas" },
    ],
  },
  {
    title: "Sale & Offers",
    icon: Tag,
    subcategories: [
      { title: "New Arrivals", url: "/category/new-arrivals" },
      { title: "Clearance Sale", url: "/category/sale" },
      { title: "Deals of the Day", url: "/category/deals" },
    ],
  },
];

export function CategorySidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-border" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <Collapsible key={category.title} asChild defaultOpen={false}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={category.title}>
                        <category.icon className="h-4 w-4" />
                        {open && <span>{category.title}</span>}
                        {open && <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {category.subcategories.map((subcat) => (
                          <SidebarMenuSubItem key={subcat.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subcat.url}>
                                <span>{subcat.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
