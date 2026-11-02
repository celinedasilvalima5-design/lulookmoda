# Lu Look Moda — site estático para GitHub Pages

## Arquivos
- `index.html`: conteúdo e estrutura do site.
- `style.css`: cores, layout, animações e adaptação para celular.
- `script.js`: catálogo, busca, filtros, sacola e encaminhamento ao Instagram.
- `images/`: coloque aqui as fotos reais dos produtos quando estiverem prontas.

## Como publicar pelo celular
1. Entre em https://github.com e abra seu repositório `lu-look-moda`.
2. Toque em **Add file → Upload files**.
3. Envie `index.html`, `style.css` e `script.js` para a raiz do repositório (não envie apenas o ZIP).
4. Confirme em **Commit changes**.
5. Abra **Settings → Pages**.
6. Em **Build and deployment**, selecione **Deploy from a branch**.
7. Selecione a branch `main` e a pasta `/ (root)`, depois toque em **Save**.
8. Aguarde alguns minutos e abra o endereço indicado na área Pages.

## Como funcionam os pedidos
A cliente pode pesquisar, filtrar e colocar várias peças na sacola. Ao continuar, o site copia o resumo do pedido (quando o navegador permite) e abre o Instagram `@lulook_moda`. No Instagram, a cliente deve colar o resumo na conversa/DM e confirmar disponibilidade e pagamento.

**Importante:** o Instagram não permite que este site envie uma mensagem privada automaticamente. A cliente precisa enviar a mensagem manualmente. O site também não processa pagamentos.

## Atualizar produtos, preços e estoque
Edite a lista `products` no começo de `script.js`. Depois salve com **Commit changes**. O GitHub Pages publica a alteração após alguns minutos.

- `stock: 2` mostra “Restam 2 unidades” e limita a seleção a duas unidades nessa sessão.
- `stock: 1` mostra “Última unidade”.
- `stock: null` significa que a quantidade não foi informada; não é exibido um aviso de estoque.

O GitHub Pages é uma hospedagem estática: o carrinho não é um sistema de vendas com banco de dados. Ele não atualiza estoque de forma compartilhada quando alguém compra. Para remover uma peça vendida para todos, edite `script.js`, altere `stock` para `0` (ela some do catálogo) ou remova o produto da lista. Para que o estoque seja atualizado automaticamente entre clientes, será necessário integrar um banco de dados/serviço externo.

## Adicionar fotos reais
1. Crie a pasta `images` no repositório, se ainda não existir.
2. Envie a foto para essa pasta, por exemplo `images/pijama-barbara.jpg`.
3. Para cada produto, podemos adicionar uma propriedade `image: "images/pijama-barbara.jpg"` e ajustar o cartão para exibi-la. O modelo inicial usa ilustrações decorativas como espaço reservado, pois as fotos reais ainda não foram fornecidas.

## Dados incluídos
O catálogo usa apenas os produtos, preços, tamanhos e cores fornecidos. Onde a cor ou o tamanho não foi informado, o site exibe “não informada/o”. O produto com quantidade conhecida (conjunto robe e camisola) mostra duas unidades.
