import { DI } from "../../configs/db";
import { Equipamento } from "../../configs/equipamento.entity";
import { SolicitacaoCalibracao } from "../../configs/solicitacao-calibracao.entity";
import { Documento } from "../../configs/documento.entity";
import PDFDocument from "pdfkit";

export class ReportService {
  public async getDashboardMetrics() {
    const em = DI.em.fork();
    
    // Total de equipamentos
    const totalEquipamentos = await em.count(Equipamento);
    
    // Ativos vs Inativos
    const equipamentosAtivos = await em.count(Equipamento, { status: { $ne: "inativo" } });
    const equipamentosInativos = await em.count(Equipamento, { status: "inativo" });
    
    // Equipamentos vencidos
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const equipamentosVencidos = await em.count(Equipamento, {
      dataVencimentoCalibracao: { $lt: hoje },
      status: { $ne: "inativo" },
    });
    
    // Solicitações pendentes
    const solicitacoesPendentes = await em.count(SolicitacaoCalibracao, {
      status: "aberta",
    });

    // Laudos aguardando assinatura (statusAssinatura = false)
    const laudosPendentes = await em.count(Documento, {
      statusAssinatura: false,
    });

    return {
      totalEquipamentos,
      equipamentosAtivos,
      equipamentosInativos,
      equipamentosVencidos,
      solicitacoesPendentes,
      laudosPendentes,
    };
  }

  public async generateEquipmentPdfReport(): Promise<Buffer> {
    const em = DI.em.fork();
    const equipamentos = await em.find(Equipamento, {}, { orderBy: { codigo: "ASC" } });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Cabeçalho
      doc.fontSize(20).text("Relatório de Equipamentos", { align: "center" });
      doc.moveDown();
      doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, { align: "right" });
      doc.moveDown(2);

      // Tabela (Header)
      const tableTop = doc.y;
      const col1 = 30;  // Código
      const col2 = 120; // Descrição
      const col3 = 350; // Status
      const col4 = 450; // Vencimento

      doc.font("Helvetica-Bold");
      doc.text("Código", col1, tableTop);
      doc.text("Descrição", col2, tableTop);
      doc.text("Status", col3, tableTop);
      doc.text("Vencimento", col4, tableTop);
      
      doc.moveTo(30, tableTop + 15).lineTo(560, tableTop + 15).stroke();

      // Linhas da tabela
      doc.font("Helvetica");
      let y = tableTop + 25;

      for (const eq of equipamentos) {
        if (y > 750) {
          doc.addPage();
          y = 30;
        }

        const vencimentoFormatado = eq.dataVencimentoCalibracao
          ? eq.dataVencimentoCalibracao.toLocaleDateString("pt-BR")
          : "N/A";

        // Truncar descrição se muito longa
        const descricaoCurta = eq.descricao.length > 35 
          ? eq.descricao.substring(0, 32) + "..." 
          : eq.descricao;

        doc.text(eq.codigo, col1, y);
        doc.text(descricaoCurta, col2, y);
        doc.text(eq.status, col3, y);
        doc.text(vencimentoFormatado, col4, y);

        y += 20;
      }

      // Rodapé
      doc.moveTo(30, y).lineTo(560, y).stroke();
      doc.moveDown();
      doc.font("Helvetica-Oblique").text(`Total de registros: ${equipamentos.length}`, { align: "left" });

      doc.end();
    });
  }
}
