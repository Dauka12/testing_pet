import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { registerStudent } from '../../api/authApi.ts';
import { RegisterStudentRequest, RegisterStudentResponse } from '../../types/student.ts';

interface RegistrationState {
    isLoading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: RegistrationState = {
    isLoading: false,
    success: false,
    error: null,
};

export const registerStudentThunk = createAsyncThunk<
    RegisterStudentResponse,
    RegisterStudentRequest,
    { rejectValue: string }
>('olympiadRegistration/register', async (studentData, { rejectWithValue }) => {
    try {
        const response = await registerStudent(studentData);
        return response;
    } catch (error) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('Unknown error occurred');
    }
});

const registrationSlice = createSlice({
    name: 'olympiadRegistration',
    initialState,
    reducers: {
        resetRegistration: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerStudentThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerStudentThunk.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(registerStudentThunk.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.isLoading = false;
                state.success = false;
                state.error = action.payload || 'Registration failed';
            });
    },
});

export const { resetRegistration } = registrationSlice.actions;
export default registrationSlice.reducer;