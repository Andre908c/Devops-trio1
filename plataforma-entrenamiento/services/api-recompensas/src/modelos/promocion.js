'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Promocion', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    plan_aplica: { type: DataTypes.ENUM('basico','pro','elite','todos'), allowNull: false, defaultValue: 'todos' },
    tipo_descuento: { type: DataTypes.ENUM('porcentaje','monto'), allowNull: false, defaultValue: 'porcentaje' },
    valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
    usos_maximos: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    usos_actuales: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    activa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    creado_por: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true }
  }, {
    tableName: 'promociones',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false
  });
};
