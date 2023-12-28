import React, { createContext, useState } from "react";

interface OutfitLinksContextProps {
  outfitLinks: any;
  setOutfitLinks: any;
}

export const OutfitLinksContext = createContext<OutfitLinksContextProps>({
  outfitLinks: [],
  setOutfitLinks: () => {},
});

export const OutfitLinksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [outfitLinks, setOutfitLinks] = useState<any>([]);

  return (
    <OutfitLinksContext.Provider value={{ outfitLinks, setOutfitLinks }}>
      {children}
    </OutfitLinksContext.Provider>
  );
};
