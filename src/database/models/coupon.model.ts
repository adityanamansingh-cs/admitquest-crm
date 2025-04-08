import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface Coupon {
    id: number;
    code: string;
    discount: number;
    capping?: number;
    type_discount: 'percentage' | 'flat';
    type: 'student' | 'institute' | 'course' | 'program';
    type_id: number;
    expiry: Date;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type CouponCreationAttributes = Optional<
    Coupon,
    'id' | 'capping' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export class CouponModel
    extends Model<Coupon, CouponCreationAttributes>
    implements Coupon
{
    public id!: number;
    public code!: string;
    public discount!: number;
    public capping?: number;
    public type_discount!: 'percentage' | 'flat';
    public type!: 'student' | 'institute' | 'course' | 'program';
    public type_id!: number;
    public expiry!: Date;
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof CouponModel {
    CouponModel.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            discount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            capping: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            type_discount: {
                type: DataTypes.ENUM('percentage', 'flat'),
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM(
                    'student',
                    'institute',
                    'course',
                    'program',
                ),
                allowNull: false,
            },
            type_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            expiry: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
        },
        {
            tableName: 'coupons',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return CouponModel;
}
