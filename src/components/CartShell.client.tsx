"use client";

import * as React from "react";
import { CartIcon } from "@/app/merch/components/CartIcon.client";
import { CartDrawer } from "@/app/merch/components/CartDrawer.client";

export function CartShell() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <CartIcon onOpen={() => setOpen(true)} />
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
