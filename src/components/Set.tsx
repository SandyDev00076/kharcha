import styled from "@emotion/styled";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pb from "../lib/pocketbase";
import {
  Container,
  DangerIconButton,
  EmptyUI,
  Expense,
  Filler,
  Greeting,
  Info,
  List,
  ListContainer,
  PrimaryButton,
  PrimaryIconButton,
  Tray,
} from "../style/shared";
import { ExpensesResponse, SetsResponse } from "../types/pocketbase-types";
import ExpenseTile from "./ExpenseTile";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { Colors, Sizes } from "../style/variables";
import { useLoading } from "../data/loadingContext";

const SetContainer = styled(Container)`
  gap: 32px;
`;

const AddButton = styled(PrimaryButton)`
  flex: 0.6;
`;

const DeleteConfirmation = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  & > h5 {
    color: ${Colors.text};
    font-size: ${Sizes.large};
  }
`;

const RemainingExpense = styled(Expense)`
  margin-bottom: 20px;
`;

const DeleteButton = styled(DangerIconButton)``;

const HomeButton = styled(PrimaryIconButton)``;

const ExpenseBar = styled.div`
  height: 8px;
  background-color: ${Colors.bg};
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
`;

interface IExpenseProgressProps {
  total: number;
  remaining: number;
}

const ExpenseProgress = styled.div(
  ({ total, remaining }: IExpenseProgressProps) => {
    const width = 100 - (100 / total) * remaining;
    return {
      height: "100%",
      width: `${width}vw`,
      backgroundColor: Colors.success,
    };
  }
);

function Set() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpensesResponse[]>([]);
  const [set, setSet] = useState<SetsResponse>();
  const [deleteConfirmation, showDeleteConfirmation] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  function goToHome() {
    navigate("/");
  }

  async function deleteSet() {
    // deleting the set
    if (!id) return;
    try {
      showLoading();
      await pb.collection("sets").delete(id);
      hideLoading();
      // delete all expenses of the set as well in the background
      expenses.forEach((expense) => {
        pb.collection("expenses").delete(expense.id);
      });
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }

  async function updateSet(total: number) {
    if (!id) return;
    try {
      const data = {
        ...set,
        expense: total,
      };
      const record = await pb.collection("sets").update<SetsResponse>(id, data);
      setSet(record);
    } catch (e) {
      console.error(e);
    }
  }

  function addAnExpense() {
    navigate(`/${id}/add`);
  }

  const totalExpense = useMemo(() => {
    let total = 0;
    expenses.forEach((expense) => {
      if (!expense.amount) return;
      total += expense.amount;
    });
    updateSet(total);
    return total;
  }, [expenses]);

  const totalRemaining = useMemo(() => {
    let total = 0;
    expenses
      .filter((expense) => !expense.done)
      .forEach((expense) => {
        if (!expense.amount) return;
        total += expense.amount;
      });
    return total;
  }, [expenses]);

  const getExpenses = useCallback(async () => {
    const filterQuery = `set = \"${id}\"`;
    const resultList = await pb
      .collection("expenses")
      .getList<ExpensesResponse>(1, 50, {
        filter: filterQuery,
      });
    setExpenses(resultList.items);
  }, [id]);

  const getSet = useCallback(async () => {
    if (!id) return;
    try {
      showLoading();
      const record = await pb.collection("sets").getOne<SetsResponse>(id);
      hideLoading();
      setSet(record);
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getExpenses();
  }, [id]);

  useEffect(() => {
    // get the set via id
    getSet();
  }, []);

  return (
    <SetContainer>
      {deleteConfirmation ? (
        <DeleteConfirmation>
          <h5>Sure ?</h5>
          <Filler />
          <DangerIconButton onClick={deleteSet}>
            <DeleteIcon />
          </DangerIconButton>
          <PrimaryIconButton onClick={() => showDeleteConfirmation(false)}>
            <CloseIcon />
          </PrimaryIconButton>
        </DeleteConfirmation>
      ) : (
        <Greeting>
          <HomeButton onClick={goToHome}>
            <HomeIcon />
          </HomeButton>
          <span>Set: {set && <strong>{set.name}</strong>}</span>
          <DeleteButton onClick={() => showDeleteConfirmation(true)}>
            <DeleteIcon />
          </DeleteButton>
        </Greeting>
      )}
      <ListContainer>
        <h3>
          {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
        </h3>
        {expenses.length > 0 ? (
          <List>
            {expenses.map((expense) => (
              <ExpenseTile
                expense={expense}
                key={expense.id}
                onUpdate={getExpenses}
              />
            ))}
          </List>
        ) : (
          <EmptyUI>Add one expense to get started</EmptyUI>
        )}
      </ListContainer>
      <Tray>
        {totalExpense !== 0 &&
          totalRemaining !== 0 &&
          totalExpense !== totalRemaining && (
            <ExpenseBar>
              <ExpenseProgress
                total={totalExpense}
                remaining={totalRemaining}
              />
            </ExpenseBar>
          )}
        <Info>
          {totalRemaining !== totalExpense && totalRemaining !== 0 && (
            <>
              <h4>Remaining</h4>
              <RemainingExpense>{totalRemaining.toFixed(2)}</RemainingExpense>
            </>
          )}
          <h4>Total</h4>
          <Expense>{totalExpense.toFixed(2)}</Expense>
        </Info>
        <AddButton onClick={addAnExpense}>Add</AddButton>
      </Tray>
    </SetContainer>
  );
}

export default Set;
