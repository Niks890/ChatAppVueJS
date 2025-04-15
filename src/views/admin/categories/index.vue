<template>
    <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
        <template #bodyCell="{ column }">
            <template v-if="column.key === 'operation'">
                <a>action</a>
            </template>
        </template>
    </a-table>
</template>
<script setup>
const columns = [
    {
        title: 'Full Name',
        width: 100,
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        width: 100,
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
        width: 150,
    },
    {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
        width: 150,
    },
    {
        title: 'Column 3',
        dataIndex: 'address',
        key: '3',
        width: 150,
    },
    {
        title: 'Column 4',
        dataIndex: 'address',
        key: '4',
        width: 150,
    },
    {
        title: 'Column 5',
        dataIndex: 'address',
        key: '5',
        width: 150,
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
    },
];
const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}
</script>
