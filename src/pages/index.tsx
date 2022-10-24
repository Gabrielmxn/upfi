import { Button, Box, Spinner, Flex } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { InfiniteData, useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type dataApi = {
  pages: imagesResult[],
  pageParams: [];

}
type image = {
  description: string;
  id: string;
  title: string;
  ts: number;
  url: string;
}
type imagesResult = {
  after: string;
  data: image[];
}
export default function Home(): JSX.Element {
 

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images', async ({ pageParam = null}) => { 
      const response = await api.get('/api/images', {
        params: {
          after: pageParam,
        },
      })

      return response.data;
    },
    {
      getNextPageParam: (data: imagesResult) => {
        if(data.after && data.after !== null){
          return data.after;
        }

        return null;
        
      }
    }
  );

  const formattedData = useMemo(()  => {
      const arrayCompletImages = data?.pages.map(page => {
        return page.data;
      }).flat()

      return arrayCompletImages || [];
     }
      
   , [data]);

  return (
    <>
    {(isLoading) 
      ? (<Flex w="full" h="full" justify="center" align="center">
          <Loading />
        </Flex>)
      
      : isError
      ? (<Error />) 
      :
      (<>
          <Header />
          <Box maxW={1120} px={20} mx="auto" my={20}>
            <CardList cards={formattedData} />
            {hasNextPage && 
              <Button mt={3} onClick={() => fetchNextPage()}>
                {isFetchingNextPage ? <span>Carregando...</span> : <span>Carregar mais</span>}
              </Button>
            }
          </Box>
          </>
        ) 

        }
    </>
  );
}
