'use strict';
const { PlanNutricional } = require('../baseDatos');

const MENU_EJEMPLO = {
  lunes: { desayuno: 'Avena + proteína', almuerzo: 'Pollo + arroz + brócoli', cena: 'Salmón + ensalada' },
  martes: { desayuno: 'Huevos + tostadas', almuerzo: 'Carne magra + batata', cena: 'Merluza + verduras' },
  miercoles: { desayuno: 'Yogur + frutos rojos', almuerzo: 'Pavo + pasta integral', cena: 'Tortilla + ensalada' }
};

module.exports = {
  async obtenerPlanAtleta(atletaId, planUsuario) {
    if (planUsuario === 'basico') {
      const e = new Error('El plan Básico no incluye nutrición completa. Mejora a Pro o Elite.');
      e.status = 403;
      throw e;
    }
    let plan = await PlanNutricional.findOne({
      where: { atleta_id: atletaId },
      order: [['creado_en', 'DESC']]
    });
    if (!plan) {
      plan = await PlanNutricional.create({
        atleta_id: atletaId,
        objetivo: 'definicion',
        kcal_dia: 2100,
        proteinas_g: 160,
        carbohidratos_g: 180,
        grasas_g: 60,
        menu_json: MENU_EJEMPLO,
        notas: 'Plan inicial generado automáticamente'
      });
    }
    return plan;
  },

  async actualizarPlan(atletaId, datos) {
    let plan = await PlanNutricional.findOne({ where: { atleta_id: atletaId }, order: [['creado_en', 'DESC']] });
    if (!plan) {
      plan = await PlanNutricional.create({ atleta_id: atletaId, ...datos });
    } else {
      await plan.update(datos);
    }
    return plan;
  }
};
