JotaQuali

1. Introdução

O sistema tem como objetivo controlar os equipamentos utilizados por uma empresa da
construção civil, garantindo o cadastro, acompanhamento da validade de regulagens e
aferições, gestão documental, assinatura digital, controle de disponibilidade e envio de
notificações relacionadas ao vencimento das calibrações.
O sistema deverá permitir o registro de equipamentos enviados a laboratórios
especializados para calibração/regulagem, bem como o registro de calibrações internas
realizadas com base em equipamentos que possuam documento válido. Também deverá
controlar a assinatura digital obrigatória dos documentos, impedir o uso de equipamentos
vencidos ou com documentação pendente e automatizar notificações por e-mail conforme
regras de prazo e escalonamento.

2. Objetivo do Sistema

Desenvolver um sistema capaz de:
● cadastrar e gerenciar equipamentos;
● controlar laudos laboratoriais e calibrações internas;
● controlar prazos de validade;
● gerar documentos em PDF para calibrações internas;
● exigir assinatura digital do chefe do setor de qualidade;
● controlar a disponibilidade dos equipamentos para uso nas obras;
● gerenciar usuários, perfis e obras;
● permitir solicitação de calibração de equipamentos;
● controlar prazo de retorno informado pelo laboratório ou calibrador interno;
● emitir notificações automáticas por e-mail;
● emitir relatórios gerenciais e operacionais.

3. Requisitos Funcionais

3.1 Cadastro de Equipamentos

RF01. O sistema deve permitir o cadastro de equipamentos utilizados pela empresa.
RF02. O sistema deve permitir consultar, editar, ativar e inativar equipamentos cadastrados.
RF03. O sistema deve armazenar, no mínimo, os seguintes dados do equipamento: código,
descrição, tipo, status, data de cadastro, obra de alocação, data da última calibração e data
de vencimento da calibração.
RF04. O sistema deve permitir associar cada equipamento a uma obra.
RF05. O sistema deve permitir visualizar o histórico de laudos, calibrações, movimentações,
assinaturas e notificações de cada equipamento.
RF06. O sistema deve possuir no cadastro do equipamento a ação “Solicitar calibração”.

3.2 Controle de Laudos Laboratoriais

RF07. O sistema deve permitir o cadastro de laudos laboratoriais vinculados a um
equipamento.
RF08. O sistema deve armazenar a data de emissão e a data de validade do laudo.
RF09. O sistema deve registrar o laboratório responsável pelo laudo.
RF10. O sistema deve permitir informar os instrumentos, padrões e recursos utilizados pelo
laboratório na regulagem do equipamento.
RF11. O sistema deve permitir anexar o arquivo do laudo ao cadastro do equipamento.
RF12. O sistema deve registrar que o laudo está pendente de assinatura digital até que seja
validado pelo administrador.
3.3 Controle de Calibração Interna

RF13. O sistema deve permitir registrar calibrações internas realizadas por usuário com
perfil calibrador.
RF14. O sistema deve exigir a indicação do equipamento de referência utilizado na
calibração interna.
RF15. O sistema deve permitir registrar a data da calibração interna e sua data de validade.
RF16. O sistema deve registrar o usuário responsável pela calibração interna.

RF17. O sistema deve permitir informar os instrumentos, padrões e recursos utilizados na
calibração interna.
RF18. O sistema deve impedir o registro de calibração interna caso o equipamento de
referência esteja vencido, indisponível ou com documentação pendente.
3.4 Geração de Documento para Calibração Interna

RF19. O sistema deve gerar automaticamente um documento em PDF para cada calibração
interna registrada sem laudo laboratorial.
RF20. O documento PDF deve conter, no mínimo: identificação do equipamento calibrado,
equipamento de referência, data da calibração, validade, nome do responsável pela
calibração e CPF do responsável.
RF21. O sistema deve registrar o documento gerado como pendente de assinatura digital.
RF22. O sistema deve permitir que o administrador assine digitalmente o PDF gerado.
3.5 Assinatura Digital

RF23. O sistema deve permitir a assinatura digital de laudos laboratoriais pelo usuário com
perfil administrador.
RF24. O sistema deve permitir a assinatura digital de documentos gerados a partir de
calibrações internas pelo usuário com perfil administrador.
RF25. O sistema deve registrar data, hora e usuário responsável pela assinatura digital.
RF26. O sistema deve impedir que usuários sem permissão realizem assinatura digital.
3.6 Controle de Validade e Disponibilidade

RF27. O sistema deve controlar automaticamente a validade de laudos laboratoriais e
calibrações internas.
RF28. O sistema deve identificar automaticamente equipamentos com validade vencida.
RF29. O sistema deve identificar automaticamente equipamentos com documentos
pendentes de assinatura.
RF30. O sistema deve disponibilizar para uso apenas equipamentos com validade vigente e
documentação devidamente assinada.
RF31. O sistema deve bloquear a utilização de equipamentos vencidos, sem assinatura ou
com irregularidade documental.
RF32. O sistema deve apresentar o status do equipamento, como por exemplo: disponível,
indisponível, vencido, pendente de assinatura, pendente de documento, calibração
solicitada, em calibração ou em manutenção.

RF33. O sistema deve alertar sobre vencimentos próximos de laudos e calibrações.
3.7 Solicitação de Calibração

RF34. O sistema deve permitir que o usuário administrador registre a solicitação de
calibração do equipamento por meio de um botão ou ação específica no cadastro do
equipamento.
RF35. Ao solicitar a calibração, o sistema deve exigir a informação do tipo de calibração,
podendo ser externa por laboratório ou interna por calibrador.
RF36. Ao solicitar a calibração, o sistema deve exigir o preenchimento do prazo de entrega
informado pelo laboratório ou do prazo informado pelo calibrador interno.
RF37. Após o registro da solicitação de calibração, o sistema deve interromper os avisos
preventivos de vencimento referentes à ausência de providência do administrador para
aquele equipamento.
RF38. Após o registro da solicitação de calibração, o equipamento deve assumir o status
“pendente de documento” ou “calibração solicitada”, conforme parametrização do sistema.
RF39. O sistema deve controlar o prazo de retorno informado no momento da solicitação da
calibração.
RF40. Caso o prazo de retorno informado seja atingido e nenhum documento tenha sido
anexado, o sistema deve disparar notificação por e-mail ao administrador.
RF41. Caso faltem 7 dias para o vencimento da calibração do equipamento e ainda não
exista documento anexado, o sistema deve disparar notificação por e-mail ao superior do
setor de qualidade.
3.8 Notificações por E-mail

RF42. O sistema deve enviar notificações automáticas por e-mail ao administrador quando
faltarem 60 dias para o vencimento da calibração do equipamento, caso ainda não tenha
sido registrada solicitação de calibração.
RF43. O sistema deve enviar notificações automáticas por e-mail ao administrador quando
faltarem 30 dias para o vencimento da calibração do equipamento, caso ainda não tenha
sido registrada solicitação de calibração.
RF44. O sistema deve enviar notificações automáticas por e-mail ao administrador quando
faltarem 15 dias para o vencimento da calibração do equipamento, caso ainda não tenha
sido registrada solicitação de calibração.
RF45. O sistema deve enviar notificações automáticas por e-mail ao administrador quando
faltarem 10 dias para o vencimento da calibração do equipamento, caso ainda não tenha
sido registrada solicitação de calibração.

RF46. Caso a solicitação de calibração não tenha sido registrada e faltem 7 dias para o
vencimento do equipamento, o sistema deve enviar notificação por e-mail ao superior do
setor de qualidade.
RF47. O sistema deve registrar o histórico das notificações enviadas, contendo data, hora,
destinatário, tipo de alerta e equipamento relacionado.
3.9 Cadastro de Obras

RF48. O sistema deve permitir o cadastro de obras.
RF49. O sistema deve permitir associar equipamentos às obras cadastradas.
RF50. O sistema deve permitir consultar os equipamentos vinculados a cada obra.
RF51. O sistema deve permitir registrar transferências de equipamentos entre obras,
mantendo histórico da movimentação.
3.10 Cadastro de Usuários e Perfis

RF52. O sistema deve permitir o cadastro de usuários.
RF53. O sistema deve permitir o cadastro de perfis de acesso.
RF54. O sistema deve permitir associar perfis aos usuários cadastrados.
RF55. O sistema deve controlar permissões de acesso de acordo com o perfil do usuário.
RF56. O sistema deve possuir, inicialmente, os perfis: administrador, calibrador, operacional
e consulta.
RF57. O sistema deve permitir que apenas o administrador altere permissões e
parametrizações dos perfis de acesso.
RF58. O sistema deve registrar qual usuário realizou cada operação relevante no sistema.
3.11 Relatórios

RF59. O sistema deve emitir relatório de equipamentos por obra.
RF60. O sistema deve emitir relatório de equipamentos vencidos.
RF61. O sistema deve emitir relatório de equipamentos próximos do vencimento.
RF62. O sistema deve emitir relatório de equipamentos pendentes de assinatura.
RF63. O sistema deve emitir relatório de equipamentos com calibração solicitada e
pendentes de documento.

RF64. O sistema deve emitir relatório do histórico de laudos, calibrações, assinaturas e
notificações por equipamento.
RF65. O sistema deve permitir filtros por obra, equipamento, período, status, tipo de
documento e responsável.
RF66. O sistema deve permitir exportar relatórios em PDF. 4. Requisitos Não Funcionais
4.1 Segurança

RNF01. O sistema deve exigir autenticação por login e senha.
RNF02. O sistema deve restringir funcionalidades conforme o perfil de acesso do usuário.
RNF03. O sistema deve garantir que apenas usuários autorizados possam realizar
assinaturas digitais.
RNF04. O sistema deve armazenar senhas de forma criptografada.
RNF05. O sistema deve registrar logs de acesso e de ações críticas, como cadastros,
edições, exclusões, assinaturas, alterações de status e envio de notificações.
4.2 Integridade e Rastreabilidade

RNF06. O sistema deve manter histórico das alterações realizadas em equipamentos,
laudos, calibrações, usuários, obras, solicitações e notificações.
RNF07. O sistema não deve permitir exclusão física de registros críticos, devendo utilizar
inativação lógica quando necessário.
RNF08. O sistema deve garantir a integridade entre equipamento, laudo, documento
gerado, obra, solicitação de calibração, assinatura digital e usuário responsável.
4.3 Desempenho

RNF09. O sistema deve apresentar consultas e listagens em tempo adequado para uso
operacional.
RNF10. O sistema deve gerar documentos PDF de forma rápida e estável.
RNF11. O sistema deve suportar acessos simultâneos de múltiplos usuários sem
comprometer a operação.
RNF12. O sistema deve executar rotinas automáticas de verificação de vencimento e envio
de e-mails sem comprometer o desempenho do sistema principal.
4.4 Usabilidade

RNF13. O sistema deve possuir interface simples, intuitiva e de fácil utilização.
RNF14. O sistema deve exibir de forma clara o status de validade, assinatura e solicitação
de calibração dos equipamentos.
RNF15. O sistema deve permitir pesquisa rápida de equipamentos, usuários, obras e
documentos.
RNF16. O sistema deve apresentar visualmente os prazos de vencimento e as pendências
documentais.
4.5 Disponibilidade e Confiabilidade

RNF17. O sistema deve estar disponível durante o horário de operação da empresa.
RNF18. O sistema deve possuir rotina de backup dos dados e documentos.
RNF19. O sistema deve permitir recuperação das informações em caso de falha.
RNF20. O sistema deve manter consistência dos dados após falhas de sistema ou
interrupções.
4.6 Compatibilidade e Evolução

RNF21. O sistema deve ser acessível em navegadores web modernos.
RNF22. O sistema deve permitir visualização e geração de documentos PDF.
RNF23. O sistema deve possuir integração com serviço de envio de e-mails.
RNF24. O sistema deve ser desenvolvido de forma modular, facilitando manutenção e
expansão futura. 5. Regras de Negócio

RN01. Todo laudo emitido por laboratório deve ser obrigatoriamente assinado digitalmente
pelo administrador, que representa o chefe do setor de qualidade.
RN02. Toda calibração interna sem laudo laboratorial deve gerar automaticamente um
documento PDF para assinatura digital do administrador.
RN03. Equipamentos calibrados internamente devem possuir validade menor que
equipamentos regulados diretamente por laboratório.

RN04. Um equipamento somente poderá ser disponibilizado para uso quando estiver com
validade vigente e documentação devidamente assinada.
RN05. A calibração interna somente poderá ser realizada com base em equipamento de
referência que possua laudo ou calibração válida e assinada.
RN06. Equipamentos vencidos, com pendência documental ou sem assinatura digital
devem permanecer indisponíveis para uso.
RN07. Toda ação relevante realizada no sistema deve estar vinculada a um usuário
responsável.
RN08. O administrador será o único perfil autorizado a validar documentalmente laudos e
PDFs gerados pelo sistema.
RN09. Os perfis inicialmente disponíveis no sistema serão: administrador, calibrador,
operacional e consulta.
RN10. Apenas o administrador poderá ajustar permissões dos perfis por meio de tela
específica do sistema.
RN11. O sistema deve notificar o administrador quando faltarem 60, 30, 15 e 10 dias para o
vencimento da calibração do equipamento, desde que ainda não tenha sido registrada a
solicitação de calibração.
RN12. Ao registrar a solicitação de calibração, o sistema deve interromper os avisos
preventivos de vencimento relacionados à ausência de providência do administrador.
RN13. Ao registrar a solicitação de calibração, o sistema deve exigir o prazo de retorno
informado pelo laboratório ou pelo calibrador interno.
RN14. Caso o prazo de retorno informado seja atingido e não exista documento anexado, o
sistema deve notificar o administrador.
RN15. Caso faltem 7 dias para o vencimento da calibração do equipamento e a situação
ainda não tenha sido resolvida, o sistema deve notificar o superior do setor de qualidade.
RN16. O perfil consulta poderá visualizar apenas equipamentos que estejam disponíveis
para retirada ou uso.
RN17. O perfil calibrador poderá registrar calibração interna, mas não poderá salvar, editar,
excluir ou assinar outros tipos de registros fora de sua função específica.
RN18. O perfil operacional poderá realizar operações de cadastro, edição e exclusão
conforme permissões definidas pelo administrador, mas não poderá assinar documentos,
salvo alteração futura de perfil. 6. Perfis de Usuário
6.1 Administrador

Responsável por representar o chefe do setor de qualidade no sistema. Possui acesso total
às funcionalidades, podendo cadastrar, editar, excluir, visualizar, assinar documentos
digitalmente, solicitar calibração, ajustar permissões dos perfis e acompanhar relatórios e
notificações.
6.2 Calibrador

Responsável por realizar calibrações internas. Pode visualizar os dados do sistema e
registrar calibração interna conforme sua função, mas não pode editar configurações gerais,
excluir registros, alterar permissões de perfil nem assinar documentos.
6.3 Operacional

Responsável pelas rotinas operacionais do sistema. Pode salvar, editar e excluir registros
conforme permissões definidas pelo administrador, porém não pode assinar documentos
digitalmente.
6.4 Consulta

Responsável apenas por consultar os equipamentos disponíveis para retirada e utilização.
Não pode cadastrar, editar, excluir, assinar ou solicitar calibração. 7. Casos de Uso Principais

C01. Cadastrar equipamento.
C02. Vincular equipamento a uma obra.
C03. Registrar laudo laboratorial.
C04. Anexar documento de laudo.
C05. Assinar digitalmente laudo laboratorial.
C06. Registrar calibração interna.
C07. Gerar PDF de calibração interna.
C08. Assinar digitalmente PDF de calibração interna.
C09. Consultar validade e status do equipamento.
C10. Solicitar calibração do equipamento.
C11. Informar prazo de retorno da calibração.
C12. Anexar documentação de retorno da calibração.
C13. Bloquear equipamento vencido ou pendente.
C14. Transferir equipamento entre obras.
C15. Cadastrar usuários e perfis.
C16. Ajustar permissões dos perfis.
C17. Emitir relatórios gerenciais e operacionais.
C18. Enviar notificações automáticas de vencimento e pendência.
