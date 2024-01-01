"use client";
import Header from "@/components/Header/header";
import { Image, Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import styles from "./page.module.css";
import AppContainer from "@/components/Contaner/container";
import { useEffect, useState } from "react";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [list, setList] = useState([]);
  const [cats, setCats] = useState([]);

  const getProducts = async (cat) => {
    let url = "https://final-task-noaf.vercel.app/api/products";
    if (cat) url = `https://final-task-noaf.vercel.app/api/products?cat=${cat}`;

    try {
      let res = await fetch(url);
      let jsonData = await res.json();
      setList(jsonData);
    } catch (error) {}
  };

  const getCategories = async () => {
    try {
      let res = await fetch("https://final-task-noaf.vercel.app/api/categories");
      let jsonData = await res.json();
      setCats(jsonData);
    } catch (error) {}
  };

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  const handleAdd = (item) => {
    let index = cart?.findIndex((el) => el.product.id === item.id);
    if (index === -1) {
      let newObj = { product: item, qt: 1 };
      setCart([...cart, newObj]);
    }
  };

  const handleInc = (item) => {
    setCart(
      cart.map((el) => {
        if (el?.product?.id === item?.product?.id) el.qt = el.qt + 1;
        return el;
      })
    );
  };

  const handledec = (item) => {
    if (item.qt === 1)
      setCart(cart.filter((el) => el.product.id !== item.product.id));
    else
      setCart(
        cart.map((el) => {
          if (el?.product?.id === item?.product?.id) el.qt = el.qt - 1;
          return el;
        })
      );
  };

  const getTotal = () => {
    return cart
      ?.map((el) => el.product.price * el.qt)
      ?.reduce((a, b) => a + b, 0);
  };

  const handleConfirm = async () => {
    var raw = JSON.stringify({
      items: { cart },
      number: 1
    });

    try {
      let res = await fetch("https://final-task-noaf.vercel.app/api/invoice", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: raw,
      });
      let jsonData = await res.json();
      console.log(jsonData);
    } catch (error) {}
  };

  return (
    <main className={styles.home}>
      <Header />
      <AppContainer width={1300}>
        <div className={styles.content}>
          <div className={styles.items}>
            <div className={styles.categories}>
              {cats.map((el) => (
                <Card isPressable onPress={() => getProducts(el.id)}>
                  <CardBody>
                    <p>{el.name}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className="gap-6 grid grid-cols-2 sm:grid-cols-4">
              {list.map((item, index) => (
                <Card
                  shadow="sm"
                  key={index}
                  isPressable
                  onPress={() => handleAdd(item)}
                >
                  <CardBody className="overflow-visible p-0">
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      alt={item.name}
                      className="w-full object-cover h-[140px]"
                      src={item.image}
                    />
                  </CardBody>
                  <CardFooter className="text-small justify-between">
                    <b>{item.name}</b>
                    <p className="text-default-500">{item.price}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <div className={styles.invoice}>
            <h3>Items List</h3>
            <div className={styles.itemsList}>
              {cart.map((el, i) => (
                <div key={i} className={styles.invoiceCard}>
                  <div className={styles.qt}>
                    <button onClick={() => handleInc(el)}>+</button>
                    <p>{el.qt}</p>
                    <button onClick={() => handledec(el)}>-</button>
                  </div>
                  <div style={{ textAlign: "end" }}>
                    <p>{el.product.name}</p>
                    <b>{el.product.price * el.qt}</b>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.total}>
              <p>Total Value</p>
              <h1>{Number(getTotal()).toLocaleString("en")}</h1>
            </div>
            <div className={styles.action}>
              <Button onClick={handleConfirm}>Confirm</Button>
            </div>
          </div>
        </div>
      </AppContainer>
    </main>
  );
}
