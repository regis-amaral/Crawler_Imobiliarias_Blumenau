# SOBRE

Quando cheguei em Blumenau em março de 2022, me deparei com uma dificuldade enorme para encontrar um imóvel que aceitasse pets. Após rodar uma semana inteira de moto pela cidade e pegar um belo bronzeado, já quase sem esperanças, percebi que cada vez que um imóvel era anunciado, em poucos minutos já haviam várias pessoas interessadas e eu nunca conseguia ser o primeiro a entrar em contato com o proprietário ou a imobiliária. 
Para resolver esse problema e ficar na frente quando um novo anúncio surgisse, precisei criar um scraper em Node.js que verificasse constantemente vários sites a procura de novos anúncios e me notificasse via Telegram assim que eles fossem encontrados.

Gastei um sábado e um domingo para criar esse projetinho, utilizei mysql para salvar os links já encontrados, selenium para a parte de raspagem das informações dos sites e a API node-telegram-bot-api para criar a camada de comunicação do sistema com minha conta no Telegram.

Primeiramente coloquei ele a rodar em um servidor EC2 na AWS, porém como estava utilizando uma conta gratuita e de testes, a capacidade computacional não era suficiente. Logo, optei por deixar ele rodando em meu note enquanto ia pra rua procurar imóveis.

Consegui 3 imóveis para a semana seguinte, dois deles graças a esse sistema, porém acabei optando por um que encontrei via Facebook.


# Dica: Use protetor solar!
![273044274_2686060064873619_922945977297956301_n](https://github.com/regis-amaral/__ARCHIVED__Crawler_Imobiliarias_Blumenau/assets/118540708/9ac50e3b-e23e-4c60-a916-857060010063)



# ANOTAÇÕES

https://abelardoimoveis.com.br/imoveis?pretensao=alugar&tipos=23&bairros=&valor_max=1.300
https://abvaleimoveis.com.br/imoveis?pretensao=alugar&tipos=23&bairros=&valor_max=1.300
https://www.acrcimoveis.com.br/alugar/sc/blumenau/casa/valor-0_1300/ordem-valor/resultado-crescente/quantidade-24/
https://www.allesimoveis.com.br/alugar/sc/casa/valor-max_1300/ordem-recentes/resultado-crescente/quantidade-12/
https://www.blumenauimoveis.com.br/imoveis?pretensao=alugar&tipos=23&cidade=4202404&bairros=&valor_max=1.300
https://www.cadoreimoveis.com.br/imoveis?pretensao=alugar&tipos=23&valor_max=1.300
https://www.cocaimoveis.com.br/imoveis?pretensao=alugar&tipos=23&valor_max=1.300
https://www.dinamicasul.com.br/search?_token=cmbyWyZDJFrsT1KFlZYWLMReBaJUSaowv8lfsA5R&negocio=2&tipo%5B%5D=Casa&cidade=4202404&minprice=&maxprice=1.300%2C00
https://www.imoveis-sc.com.br/blumenau/alugar/casa?ordenacao=recentes&valor=-1300
https://imoveisportal.com/busca/casa/locacao/blumenau+gaspar?valor_ate=1.300%2C00
https://www.jacintoimoveis.com.br/imoveis?pretensao=alugar&tipo=23&bairro=&valor_max=1.300
https://www.lavitaimoveis.com.br/imoveis/para-alugar/casa?preco-de-locacao=~1300
http://www.mercator10.com.br/public/search?faixa_valor_request=0-0&goalId=1&tipo=2&faixa_valor=0-1300&ref=
https://www.nestoria.com.br/blumenau/casas/aluguel?price_max=1300&sort=newest
https://sc.olx.com.br/norte-de-santa-catarina/regiao-do-vale-do-itajai/imoveis/aluguel/casas?pe=1300&sd=2453&sd=2480&sf=1
https://quintal.imb.br/imoveis-locacao.php?tipo%5B%5D=Casa+Residencial&cidade=BLUMENAU&codigo_imovel=&area_minima=&area_maxima=&valor_minimo=&valor_maximo=1300&qtd_quartos=&qtd_suites=&qtd_vagas=
https://www.schorkimoveis.com.br/imoveis/para-alugar/casa/blumenau?preco-de-locacao=~1300
https://www.shsimoveis.com/imoveis/para-alugar/casa?preco-de-locacao=+1300
https://www.tropical.imb.br/imoveis/para-alugar/casa?preco-de-locacao=~1300
https://www.wimoveis.com.br/casas-aluguel-blumenau-sc-menos-1300-reales-ordem-publicado-maior.html


ACESSO AO SERVIDOR AWS

ssh -i "blumenau_imoveis.pem" ubuntu@ec2-54-232-240-110.sa-east-1.compute.amazonaws.com


https://marquesfernandes.com/desenvolvimento/criando-um-servico-linux-com-systemd/



