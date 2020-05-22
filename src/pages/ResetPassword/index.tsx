import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background, AnimationContainer } from './styles';

import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface ResetPasswordFormDate {
  password: string;
  passwordConfirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormDate) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
          passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Confirmação incorreta',
          ),
        });
        await schema.validate(data, { abortEarly: false });

        const { password, passwordConfirmation } = data;
        const token = location.search.replace('?token=', '');
        if (!token) {
          throw new Error();
        }
        await api.post('password/reset-password', {
          password,
          passwordConfirmation,
          token,
        });

        history.push('/');

        addToast({
          type: 'success',
          title: 'Atualização da senha',
          description: 'Senha atualizada com sucesso',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Houve um erro ao alterar a senha.',
        });
      }
    },
    [history, addToast, location],
  );
  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Logo" />
          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Recuperar Senha</h1>

            <Input
              name="password"
              placeholder="Nova senha"
              type="password"
              icon={FiLock}
            />
            <Input
              name="passwordConfirmation"
              placeholder="Confirmação da senha"
              type="password"
              icon={FiLock}
            />
            <Button type="submit">Alterar Senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ResetPassword;
