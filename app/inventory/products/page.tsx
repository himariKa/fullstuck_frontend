'use client'

import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import productsData from "./sample/dummy_products.json";
import Link from "next/link";

type ProductData = {
    id :number | null;
    name :string;
    price :number;
    description: string;
};

// type InputData = {
//     id :string;
//     name :string;
//     price :string;
//     description :string;
// };

export default function Page(){
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    //　読み込みデータを保持
    const [data, setData] = useState<Array<ProductData>>([]);

    useEffect(() => {
        setData(productsData);
    }, [])

    //  // 登録データを保持
    //  const [input, setInput] = useState<InputData>({
    //     id :"",
    //     name :"",
    //     price :"",
    //     description :"",
    // });

    // // 登録データの値を更新
    // const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value,name } = event.target;
    //     setInput({ ...input, [name]:value });
    // };

    const [id, setId ] = useState<number | null>(0);
    // submit時のアクションを分岐させる
    const [ action, setAction ] = useState<string>("");
    const onSubmit = (event: any): void => {
        const productData: ProductData = {
            id: id,
            name: event.name,
            price: Number(event.price),
            description: event.description,
        };
        //actionによってHTTPメソッドと使用するパラメータを切り替える
        if(action === "add"){
            handleAdd(productData);
        } else if(action === "update") {
            if(productData.id === null){
                return;
            }
            handleEdit(productData);
        } else if (action === "delete") {
            if(productData.id === null){
                return;
            }
            handleDelete(productData.id);
        }
    };

    // 新規登録処理、新規登録行の表示状態を保持
    // const [showNewRow, setShowNewRow] = useState(false);
    // const handleShowNewRow = (event: React.MouseEvent<HTMLElement>) => {
    //     event.preventDefault();
    //     setShowNewRow(true)
    // };
    const handleShowNewRow = () => {
        setId(null);
        reset({
            name: "",
            price: "0",
            description: "",
        });
    };

    // const handleAddCancel = (event: React.MouseEvent<HTMLElement>) => {
    //     event.preventDefault();
    //     setShowNewRow(false)
    // };

    const handleAddCancel = () => {
        setId(0);
    };

    const handleAdd =  (newProduct : ProductData) => {
        setId(0);
    };

    // 更新・削除処理、更新・削除の行の表示状態を保持
    // const [editingRow, setEditingRow] = useState(0);
    // 編集する行を選択して、そのidに入っている名前と値段と説明を入力欄に入れている
    const handleEditRow = (id:number | null ) => {
        const selectedProduct: ProductData = data.find(
            (v) => v.id === id
        ) as ProductData;
        setId(selectedProduct.id);
        reset({
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description,
        });
    };

    const handleEditCancel = () => {
        setId(0);
    };

    const handleEdit = ( updateData: ProductData) => {
        setId(0);
    };

    const handleDelete = (productId: number) => {
        setId(0);
    };

    //　新規登録処理、新規登録行の表示状態を保持
    // const [shownNewRow, setShownNewRow ] = useState(false);
    // const handleShownNewRow = () => {
    //     setShownNewRow(true);
    // };

    return (
        <>
            <h2>商品一覧</h2>
            <button type="button" onClick={ handleShowNewRow }>商品を追加する</button>
            <form onSubmit={ handleSubmit(onSubmit) }>
                <table>
                    <thead>
                        <tr>
                            <th>商品ID</th>
                            <th>商品名</th>
                            <th>単価</th>
                            <th>説明</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {id === null  ? (
                            <tr>
                                <td></td>
                                <td><input type="text" id="name" {...register("name", {required: true, maxLength: 100})} />{errors.name && (<div>100字以内の商品名を入力してください</div>)}</td>
                                <td><input type="number" id="price" {...register("price", {required: true, min: 1, max: 99999999 })} />{errors.price && (<div>1から99999999の数字を入力してください</div>)}</td>
                                <td><input type="text" id="description" {...register("description")} /></td>
                                {/* ルーティングのために追加 */}
                                <td></td>
                                <td><button type="button" onClick={()=> handleAddCancel()}>キャンセル</button><button type="submit" onClick={()=> setAction("add")}>登録する</button></td>
                            </tr>
                        ) : ""}
                        {data.map((data: any) => (
                            id === data.id ? (
                                <tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td><input type="text" id="name" {...register("name", {required: true, maxLength: 100})} />{errors.name && (<div>100字以内の商品名を入力してください</div>)}</td>
                                    <td><input type="number" id="price" {...register("price", {required: true, min: 1, max: 99999999, valueAsNumber: true, })} />{errors.price && (<div>1から99999999の数字を入力してください</div>)}</td>
                                    <td><input type="text" id="description" {...register("description")} /></td>
                                    <td></td>
                                    <td><button type="button" onClick={()=>handleEditCancel()}>キャンセル</button><button type="submit" onClick={()=> setAction("update")}>更新する</button><button type="submit" onClick={()=>setAction("delete")}>削除する</button></td>
                                </tr>
                            ) : (
                                <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.price}</td>
                                <td>{data.description}</td>
                                <td><Link href={`/inventory/products/${data.id}`}>在庫処理</Link></td>
                                <td><button onClick={()=> handleEditRow(data.id)}>更新・削除</button></td>
                            </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </form>
        </>
    )
}
