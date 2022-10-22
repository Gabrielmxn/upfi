import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Box,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return(
      <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
        <ModalContent bgColor="pGray.800" w="max" >
          <ModalBody >
          
              <Image  src={imgUrl} sizes="full" fit="cover" alt="image" />
    
          </ModalBody>
          <ModalFooter>
            <Link  href={imgUrl} isExternal>
              Abrir original
            </Link>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}
