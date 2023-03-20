import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "antd";
import { Icons } from "~/components/shared/Icons";

const PostsCoverButton = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          type="text"
          size="small"
          className="!inline-flex !items-center space-x-2"
          icon={<Icons.media className="icon--sm" />}
        >
          Add Cover
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            {`Make changes to your profile here. Click save when you're done.`}
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              x
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PostsCoverButton;
