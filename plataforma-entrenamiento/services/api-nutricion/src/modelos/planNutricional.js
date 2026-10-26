'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PlanNutricional', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    atleta_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    objetivo: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'mantenimiento' },
    kcal_dia: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    proteinas_g: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    carbohidratos_g: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    grasas_g: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    menu_json: { type: DataTypes.JSON, allowNull: true },
    notas: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'planes_nutricionales',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });
};
