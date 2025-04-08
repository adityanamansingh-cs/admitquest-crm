import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface PaymentLog {
    id: number;
    student_id: number;
    cart_id: number;
    application_id: number;
    coupon_id?: number;
    transaction_no: string;
    response?: string;
    status: '0' | '1' | '2' | '3';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export type PaymentLogCreationAttributes = Optional<
    PaymentLog,
    | 'id'
    | 'coupon_id'
    | 'response'
    | 'status'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
>;

export class PaymentLogModel
    extends Model<PaymentLog, PaymentLogCreationAttributes>
    implements PaymentLog
{
    public id!: number;
    public student_id!: number;
    public cart_id!: number;
    public application_id!: number;
    public coupon_id?: number;
    public transaction_no!: string;
    public response?: string;
    public status!: '0' | '1' | '2' | '3';
    public created_at?: string;
    public updated_at?: string;
    public deleted_at?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default function (sequelize: Sequelize): typeof PaymentLogModel {
    PaymentLogModel.init(
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
            cart_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'carts',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            application_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'applications',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            coupon_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'coupons',
                    key: 'id',
                },
                onDelete: 'SET NULL',
            },
            transaction_no: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            response: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('0', '1', '2', '3'),
                allowNull: false,
                defaultValue: '0',
                comment: '0: Initiated, 1: Pending, 2: Success, 3: Failed',
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                ),
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: 'payment_logs',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            paranoid: true,
            timestamps: true,
        },
    );

    return PaymentLogModel;
}
