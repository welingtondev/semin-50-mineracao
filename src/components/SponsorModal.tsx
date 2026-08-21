import React from "react";

export function SponsorModal({ children }: { children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent) => {
    // If the child already has an onClick handler, call it first
    if (React.isValidElement(children) && children.props.onClick) {
      (children.props.onClick as React.MouseEventHandler)(e);
    }
    // Redirect to the new corporate sponsorship link
    window.location.href = "https://seminufba.com.br/patrocinio/";
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: handleClick,
    });
  }

  return <>{children}</>;
}
