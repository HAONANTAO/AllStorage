"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Models } from 'node-appwrite';
import { actionsDropdownItems } from '@/constants';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import { Button } from './ui/button';
const ActionsDropdown = ({file}:{file:Models.Document}) => {
  const [isModelOpen,setIsModelOpen] = useState(false);
  const [isDropDownOpen,setIsDropDownOpen] = useState(false);
  const [action,setAction] = useState<ActionType | null>(null);
  const [isLoading,setIsLoading] = useState(false)
  const [name,setName] = useState(file.name)

  // modal
  const renderDialogContent = ()=>{
    if(!action) return null
    // click for sign the value into action
    const {label,value} = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {/* determine */}
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </DialogHeader>
        {/* only those 3 has buttons */}
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row ">
            <Button>Cancel</Button>
            <Button>
              <p className="capitalize">{value}</p>
              {isLoading && (<Image src="/assets/icons/loader.svg" alt="loader" width="24" height="24" className='animate-spin'/>)}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="open"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              className="shad-dropdown-item"
              onClick={() =>
                // 如果点击了 dialog给新的model弹窗
                {
                  setAction(actionItem);
                  if (
                    ["rename", "share", "delete", "details"].includes(
                      actionItem.value,
                    )
                  ) {
                    setIsModelOpen(true);
                  }
                }
              }
              key={actionItem.value}>
              {/* 只有download点击直接可以下载 */}
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.value}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.value}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
}

export default ActionsDropdown
