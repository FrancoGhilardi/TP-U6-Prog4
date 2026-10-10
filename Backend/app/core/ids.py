INT4_MAX = 2_147_483_647


def es_id_posible(valor: int) -> bool:
    """Los ids son `integer` en Postgres: fuera de este rango no puede existir ninguna fila."""
    return 1 <= valor <= INT4_MAX
