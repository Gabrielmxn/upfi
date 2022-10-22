import { Flex, Grid, HStack, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure()
  // TODO MODAL USEDISCLOSURE

  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE
  function viewImage(url: string){
    console.log(url);
    onOpen();
    setImageUrl(url);
  }
  return (
    <>
     <Grid gap={10} templateColumns='repeat(3, 1fr)'>
      {cards.map((card) => {
        return  <Card viewImage={viewImage} key={card.id} data={{
          description: card.description,
          title: card.title,
          ts: card.ts,
          url: card.url
        }} />
      })}
     </Grid>

      <ModalViewImage  isOpen={isOpen} onClose={onClose} imgUrl={imageUrl}/>
    </>
  );
}
