"use client"

import { ChevronRight } from "lucide-react"
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import React from "react";

export function NavMain({
  items = [],
}) {
  const location = useLocation();
  const isActive = (items = []) => {
    return items.some(item => location.pathname.includes(item.url));
  }
  const activeUrl = location.pathname;

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-2">
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items ? (
                <React.Fragment>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title} 
                      isActive={isActive(item.items) || activeUrl.includes(item.url)}
                      className={`text-lg hover:bg-slate-800 hover:text-teal-400 py-3 ${(isActive(item.items) || activeUrl.includes(item.url)) ? 'bg-slate-800 text-teal-400' : 'text-gray-200'}`}
                    >
                      {item.icon && <item.icon className={`h-6 w-6 ${(isActive(item.items) || activeUrl.includes(item.url)) ? 'text-teal-400' : 'text-gray-400'}`} />}
                      <span className="font-medium">{item.title}</span>
                      <ChevronRight className="ml-auto h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub className="pl-12 py-1">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title} className="py-2">
                          <SidebarMenuSubButton 
                            isActive={activeUrl.includes(subItem.url)} 
                            asChild
                            className={`text-lg hover:text-teal-400 py-2 ${activeUrl.includes(subItem.url) ? 'text-teal-400' : 'text-gray-300'}`}
                          >
                            <Link to={subItem.url}>
                              <span className="font-medium">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </React.Fragment>
              ) : (
                <Link to={item.url}>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    isActive={isActive(item.items) || activeUrl.includes(item.url)}
                    className={`text-lg hover:bg-slate-800 hover:text-teal-400 py-3 ${(isActive(item.items) || activeUrl.includes(item.url)) ? 'bg-slate-800 text-teal-400' : 'text-gray-200'}`}
                  >
                    {item.icon && <item.icon className={`h-6 w-6 ${(isActive(item.items) || activeUrl.includes(item.url)) ? 'text-teal-400' : 'text-gray-400'}`} />}
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

NavMain.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    isActive: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }))
  }))
};
