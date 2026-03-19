export const permissionsList: Array<{
  label: string;
  module: string;
  key: string;
  message: string;
  active?: boolean;
}> = [
  // Sumário:
  // Usuários

  // Usuários
  {
    label: 'Cadastrar usuários',
    module: 'Usuários',
    key: 'cadastrar-usuario',
    message: 'Sem permissão para cadastrar usuário',
  },
  {
    label: 'Visualizar usuário',
    module: 'Usuários',
    key: 'visualizar-usuario',
    message: 'Sem permissão para visualizar usuário',
  },
  {
    label: 'Editar usuários',
    module: 'Usuários',
    key: 'editar-usuario',
    message: 'Sem permissão para editar usuário',
  },
  {
    label: 'Excluir usuários',
    module: 'Usuários',
    key: 'excluir-usuario',
    message: 'Sem permissão para excluir usuário',
  },
];
