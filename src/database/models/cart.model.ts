import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { CouponModel } from './coupon.model';

interface Cart {
    id: number;
    student_id: number;
    coupon_id: number | null;
    total_amount: number;
    discount_amount: number;
    final_amount: number;
    status: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type CartCreationAttributes = Optional<
    Cart,
    | 'id'
    | 'coupon_id'
    | 'total_amount'
    | 'discount_amount'
    | 'final_amount'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class CartModel
    extends Model<Cart, CartCreationAttributes>
    implements Cart
{
    public id!: number;
    public student_id!: number;
    public coupon_id!: number | null;
    public total_amount!: number;
    public discount_amount!: number;
    public final_amount!: number;
    public status!: boolean;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    public static associate(models: any): void {
        CartModel.belongsTo(CouponModel, {
            foreignKey: 'coupon_id',
            as: 'coupon',
        });
    }
}

export default function (sequelize: Sequelize): typeof CartModel {
    CartModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            student_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'students',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            coupon_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true, // ✅ Allow null values
                references: {
                    model: 'coupons',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            discount_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            final_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'carts',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return CartModel;
}
