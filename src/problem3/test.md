## Original Code

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};
```

## Issues

### 1: `prices` dependency in `useMemo` is redundant

- `prices` is not related to filtering and sorting, but it is still included in the `useMemo` dependencies.
- Solution : Remove `prices` from the `useMemo` dependencies or move all `formatBalance` logic into `useMemo` to make use of `prices`.

### 2: Incorrect logic in `useMemo`

- The variable `lhsPriority` is used but not defined, which causes errors.
- Solution : Replace `lhsPriority` with `balancePriority` or fix the logic accordingly.

- The `filter` logic with the condition `balance.amount <= 0` is incorrect.
- Solution : To filter balances with valid `amount` and `balancePriority`, the condition should be `balance.amount > 0` and `balancePriority !== -99`.

- The `blockchain` property in the `getPriority` function does not have a specific type, and `balance.blockchain` might throw an error as `blockchain` is not a property of `WalletBalance`.
- Solution : Define a type for the `blockchain` property and add the `blockchain` attribute to the `WalletBalance` interface.

### 3: `usePrices` does not check for the existence of values

- The code does not verify if `prices[balance.currency]` exists, which could cause errors.
- Solution : Validate the value before performing calculations or provide a default value.

### 4: Missing proper `key` control in `WalletRow`

- Using `key={index}` is not a good practice as the index can change.
- Solution : Use a unique value from the data, such as `currency`, as the `key`.

### 5: `rows` created by mapping `sortedBalances` will encounter errors with `balance.formatted`

- At this point, `sortedBalances` has the type `WalletBalance`, so accessing `balance.formatted` will throw an error because `formatted` is not a property of `WalletBalance`.
- Solution : Add logic to ensure `sortedBalances` is of type `FormattedWalletBalance` in `useMemo`.

### 6: `className={class.row}` in `WalletRow` is invalid

- The `class` object does not exist in the component, so `class.row` will throw an error.
- Solution : Remove the `className` attribute from the `WalletRow` component.

## Refactor code

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain:string;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority:number;
  usdValue:number;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances:WalletBalance[] = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const formattedBalances: FormattedWalletBalance = useMemo(() => {
    return balances
      .map((balance) => {
        const priority = getPriority(balance.blockchain);
        const usdValue = (prices[balance.currency] || 0) * balance.amount;
        return {
          ...balance,
          priority,
          usdValue,
          formatted: balance.amount.toFixed(),
        };
      })
      .filter((balance) => balance.priority !== -99 && balance.amount > 0)
      .sort((a, b) => b.priority - a.priority);
  }, [balances,prices]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance) =>  (
      <WalletRow
        key={balance.currency}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    );
  );

  return <div {...rest}>{rows}</div>;
};

```
