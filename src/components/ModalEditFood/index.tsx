import React, { useRef, useCallback } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdateFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
  editingFood: IFoodPlate;
}

interface IEditFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IErrors {
  [key: string]: string;
}

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: IEditFoodData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          image: Yup.string().required('Link da foto obrigatório'),
          name: Yup.string().required('Nome obrigatório'),
          price: Yup.number().required('Preço obrigatório'),
          description: Yup.string().required('Descrição obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { image, name, price, description } = data;

        const formData = { image, name, price, description };

        handleUpdateFood(formData);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          alert('Preencha todos os campos!');
          const validationErrors: IErrors = {};

          error.inner.forEach(err => {
            validationErrors[err.path] = err.message;
          });

          formRef.current?.setErrors(validationErrors);
        }
      }
    },
    [handleUpdateFood],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
