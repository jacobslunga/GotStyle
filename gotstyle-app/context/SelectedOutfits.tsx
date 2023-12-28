import { createContext, useState } from 'react';

interface ContextProps {
  selectedOutfits: { uri: string; base64: string }[];
  setSelectedOutfits: React.Dispatch<
    React.SetStateAction<{ uri: string; base64: string }[]>
  >;
}

export const SelectedOutfitsContext = createContext<ContextProps>({
  selectedOutfits: [],
  setSelectedOutfits: () => {},
});

export const SelectedOutfitsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedOutfits, setSelectedOutfits] = useState<
    { uri: string; base64: string }[]
  >([]);

  return (
    <SelectedOutfitsContext.Provider
      value={{ selectedOutfits, setSelectedOutfits }}
    >
      {children}
    </SelectedOutfitsContext.Provider>
  );
};
