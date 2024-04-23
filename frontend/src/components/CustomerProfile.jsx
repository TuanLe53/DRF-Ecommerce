import { ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Icon } from "@chakra-ui/icons";
import {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from "@chakra-ui/react";

export default function CustomerProfile() {

    return (
        <Tabs isLazy isFitted variant={"enclosed"} size={"lg"}>
            <TabList>
                <Tab><Icon as={ShoppingCartOutlined} /> Cart</Tab>
                <Tab><Icon as={ShoppingOutlined} />Orders</Tab>
            </TabList>
            <TabPanels>
                <TabPanel><p>Cart</p></TabPanel>
                <TabPanel><p>Orders</p></TabPanel>
            </TabPanels>
        </Tabs>
    )
}