'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { renameFile, shareFileUsers } from '@/lib/actions/file.action';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from './ActionsModalContent';

const ActionsDropdown = ({ file }: { file: Models.Document }) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([]);
  const path = usePathname();
  // clean all states
  const closeAllModals = () => {
    setIsModelOpen(false);
    setIsDropDownOpen(false);
    setAction(null);
    setName(file.name);
    // for shared
    setEmails([]);
  };
  const handleAction = async () => {
    if (!action) {
      return;
    }
    setIsLoading(true);
    let success = false;
    // according the type to actions
    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () =>
        shareFileUsers({
          fileId: file.$id,
          emails,
          path,
        }),
      delete: () => console.log('delete'),
    };
    // keyof是关键字
    // flexible executed！
    success = await actions[action.value as keyof typeof actions]();
    if (success) closeAllModals();
    setIsLoading(false);
  };

  // remove the shared email
  const handleRemoveUser = async (email: string) => {
    const updateEmails = emails.filter((e) => e !== email);
    // overwirte
    const success = await shareFileUsers({
      fileId: file.$id,
      emails: updateEmails,
      path,
    });
    if (success) setEmails(updateEmails);
    closeAllModals();
  };

  // modal 点击后显示的dialog
  const renderDialogContent = () => {
    if (!action) return null;
    // click for sign the value into action
    const { label, value } = action;
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {/* add this description to solve the  aria-describedby warning */}
          <DialogDescription>{''}</DialogDescription>
          {/* 1.rename */}
          {value === 'rename' && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === 'details' && <FileDetails file={file} />}
          {value === 'share' && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === 'delete' && (
            <p className="delete-confirmation">
              {' '}
              Are you sure you want to delete {``}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {/* only those 3 has buttons */}
        {['rename', 'delete', 'share'].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row ">
            <Button className="modal-cancel-button" onClick={closeAllModals}>
              Cancel
            </Button>
            <Button className="modal-submit-button" onClick={handleAction}>
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width="24"
                  height="24"
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
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
                  // Issue solved the overlays
                  setIsDropDownOpen(false);
                  if (
                    ['rename', 'share', 'delete', 'details'].includes(
                      actionItem.value,
                    )
                  ) {
                    setIsModelOpen(true);
                  }
                }
              }
              key={actionItem.value}>
              {/* 只有download点击直接可以下载 */}
              {actionItem.value === 'download' ? (
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
};

export default ActionsDropdown;
