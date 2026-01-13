import { useEffect, useState } from "react";

import { EDITOR_LS_KEYS } from "@excalidraw/common";

import { Dialog } from "@excalidraw/excalidraw/components/Dialog";
import DialogActionButton from "@excalidraw/excalidraw/components/DialogActionButton";
import { TextField } from "@excalidraw/excalidraw/components/TextField";
import { OpenAIIcon } from "@excalidraw/excalidraw/components/icons";
import { Button } from "@excalidraw/excalidraw/components/Button";

import "./OpenAIKeyDialog.scss";

export const OpenAIKeyDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(EDITOR_LS_KEYS.OAI_API_KEY);
    setKey(saved || "");
  }, []);

  const onSave = () => {
    if (key) {
      window.localStorage.setItem(EDITOR_LS_KEYS.OAI_API_KEY, key);
    } else {
      window.localStorage.removeItem(EDITOR_LS_KEYS.OAI_API_KEY);
    }
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        onSelect={() => setIsOpen(true)}
        style={{ width: 36, height: 36 }}
      >
        {OpenAIIcon}
      </Button>

      {isOpen && (
        <Dialog
          title={"OpenAI API key"}
          size={"small"}
          onCloseRequest={() => setIsOpen(false)}
          autofocus={false}
        >
          <div className="OpenAIKeyDialog">
            <p className="OpenAIKeyDialog__desc">
              Store your OpenAI API key locally for AI features.
            </p>

            <div className="OpenAIKeyDialog__input">
              <TextField
                value={key}
                onChange={(v) => setKey(v)}
                placeholder="sk-..."
                className="OpenAIKeyDialog__field"
                selectOnRender
                type="password"
              />
            </div>

            <div className="OpenAIKeyDialog__actions">
              <DialogActionButton
                label={"Cancel"}
                onClick={() => setIsOpen(false)}
                style={{ marginRight: 10 }}
              />

              <DialogActionButton
                label={"Save"}
                onClick={onSave}
                actionType="primary"
              />
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default OpenAIKeyDialog;
