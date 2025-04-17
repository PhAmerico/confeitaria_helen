document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.cabecalho_menu_button');
    const menuList = document.querySelector('.cabecalho_menu');
    const limparCarrinhoButton = document.querySelector('button:first-of-type');
  
    // Função para alternar a visibilidade da lista de menu e do botão de menu
    function toggleMenu() {
      menuList.classList.toggle('show-menu'); // Alternar a visibilidade da lista de menu
      toggleMenuButton(); // Alternar a visibilidade do botão de menu
    }
  
    // Função para verificar e alternar a exibição do botão de menu
    function toggleMenuButton() {
      if (window.innerWidth <= 960 && !menuList.classList.contains('show-menu')) {
        menuButton.style.display = 'inline-block'; // Exibir o botão de menu se a largura da janela for menor ou igual a 910 pixels e a lista de menu não estiver visível
      } else {
        menuButton.style.display = 'none'; // Ocultar o botão de menu caso contrário
      }
    }
  
    // Evento de clique no botão de menu
    menuButton.addEventListener('click', function() {
      toggleMenu(); // Chamar a função para alternar a visibilidade da lista de menu e do botão de menu
    });
  
    // Evento de clique no botão "Limpar Carrinho"
    limparCarrinhoButton.addEventListener('click', function() {
      // Aqui você pode adicionar a lógica para limpar o carrinho
      // Por exemplo, você pode remover todos os itens do carrinho definindo o conteúdo da seção do carrinho como vazio
      const carrinho = document.querySelector('.carrinho');
      carrinho.innerHTML = ''; // Define o conteúdo do carrinho como vazio
    });
  
    // Verificar a largura da janela ao carregar a página
    toggleMenuButton();
  
    // Verificar e alternar a exibição do botão de menu durante o redimensionamento da janela
    window.addEventListener('resize', function() {
      toggleMenuButton();
    });
  
    // Evento de clique no documento inteiro
    document.addEventListener('click', function(event) {
      if (!menuList.contains(event.target) && !menuButton.contains(event.target)) {
        if (window.innerWidth <= 960) {
          menuList.classList.remove('show-menu'); // Ocultar a lista de menu se clicar fora dela
          toggleMenuButton(); // Exibir novamente o botão de menu se a largura da janela for menor ou igual a 910 pixels
        }
      }
    });
  });
  