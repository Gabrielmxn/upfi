import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { FieldError, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}
type errorsMessage = {
  image: FieldError;

}
export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptedFormatsRegex =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;

  const formValidations = {
    image: {
      required: true,
      validate: {
        lessThan10MB: fileList =>
          fileList[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: fileList =>
          acceptedFormatsRegex.test(fileList[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      }
    },
    title: {
      required: true,
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres'
      },
      maxLength: {
        value: 20,
        message: "Máximo de 20 caracteres"
      }
    },
    description: {
      required: true,
      maxLength: {
        value: 65,
        message: "Máximo de 65 caracteres"
      }
    },
  };
  async function postImage(t){
    const response = await api.post('/images', t)
    return response.data
  }
  const queryClient = useQueryClient();
  const mutation = useMutation((t) => postImage(t),
    {
      onSuccess: () => queryClient.invalidateQueries(['images'])
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    console.log(imageUrl);
    try {
      console.log(data);
      console.log("aqui")
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if(!imageUrl){
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.'
        })
        return;
      }

      const response = await mutation.mutateAsync({
        ...data,
        url: imageUrl
      } as any)

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.'
      })
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.'
      })
    } finally {
      reset();
      closeModal();
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
    }
  };

  return (
    
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image) }
          error={{...errors?.image as any} as  FieldError}
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />
    
        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
         
          {...register('title', formValidations.title) }
          error={{...errors?.title as any} as  FieldError}
        />
        <TextInput
          placeholder="Descrição da imagem..."
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description) }
          error={{...errors?.description as any} as  FieldError}
        />
      </Stack>
      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
